import {
  PaymentProvider,
  RentalRequestStatus,
} from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createPaymentSession = async (
  userId: string,
  rentalRequestId: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
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
  if (rentalRequest.payment) {
    throw new Error("Payment already completed.");
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

  await prisma.payment.create({
    data: {
      rentalRequestId: rentalRequest.id,
      checkoutSessionId: session.id,
      amount: amount,
      provider: PaymentProvider.STRIPE,
    },
  });

  return {
    checkoutUrl: session.url,
  };
};

export const paymentService = {
  createPaymentSession,
};
