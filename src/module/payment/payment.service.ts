import {
  PaymentProvider,
  PaymentStatus,
  RentalRequestStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handleCheckoutSessionCompleted } from "./payment.utils";

const createPaymentSession = async (
  userId: string,
  rentalRequestId: string,
) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const rentalRequest = await tx.rentalRequest.findUniqueOrThrow({
      where: {
        id: rentalRequestId,
      },
      include: {
        property: true,
        author: true,
        payment: true,
      },
    });

    if (rentalRequest.status !== RentalRequestStatus.APPROVED) {
      throw new Error("Rental Request Is Not Approved");
    }
    if (rentalRequest.tenantId !== userId) {
      throw new Error("You are not allowed to pay this rental.");
    }

    const amount = rentalRequest.agreedRent ?? rentalRequest.property.rent;

    if (amount <= 0) {
      throw new Error("Invalid payment amount");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: amount * 100,
            product_data: {
              name: rentalRequest.property.title,
            },
          },
          quantity: 1,
        },
      ],
      customer_email: rentalRequest.author.email,

      metadata: {
        rentalRequestId: rentalRequest.id,
        tenantId: rentalRequest.tenantId,
      },
      success_url: `${config.app_url}/payment-success`,
      cancel_url: `${config.app_url}/payment-cancel`,
    });

    const existingPayment = rentalRequest.payment;

    if (existingPayment?.status === PaymentStatus.PAID) {
      throw new Error("Payment already completed.");
    }

    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          rentalRequestId: rentalRequest.id,
          checkoutSessionId: session.id,
          amount: amount,
          provider: PaymentProvider.STRIPE,
        },
      });
    } else {
      await prisma.payment.update({
        where: {
          id: existingPayment.id,
        },
        data: {
          checkoutSessionId: session.id,
        },
      });
    }
    return session.url;
  });

  return {
    checkoutUrl: transactionResult,
  };
};

const handleWebhook = async (signature: string, payload: Buffer) => {
  const endPointSecret = config.stripe_webhook_secret;
  let event;

  if (endPointSecret) {
    try {
      event = stripe.webhooks.constructEvent(
        payload,
        signature,
        endPointSecret,
      );
    } catch (error: any) {
      throw new Error("Invalid Stripe webhook signature.");
    }
  }

  switch (event?.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object);

      break;

    default:
      console.log(`Unhandled event type ${event?.type}.`);
  }
};

const getUserPaymentHistory = async (userid: string) => {
  const payment = await prisma.payment.findMany({
    where: {
      rentalRequest: {
        tenantId: userid,
      },
    },
    include: {
      rentalRequest: {
        include: {
          property: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return payment;
};

export const paymentService = {
  createPaymentSession,
  handleWebhook,
  getUserPaymentHistory,
};
