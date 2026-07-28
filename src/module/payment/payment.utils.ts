import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import {
  PaymentStatus,
  RentalRequestStatus,
} from "../../../generated/prisma/enums";

export const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      checkoutSessionId: session.id,
    },
  });

  if (!payment) {
    console.warn("Payment not found for checkout session:", session.id);
    return;
  }

  if (payment.status === PaymentStatus.PAID) {
    console.log("Webhook already processed");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: {
        id: payment.id,
      },
      data: {
        status: PaymentStatus.PAID,
        transactionId: session.payment_intent as string,
        paidAt: new Date(),
      },
    });
    await tx.rentalRequest.update({
      where: {
        id: payment.rentalRequestId,
      },
      data: {
        status: RentalRequestStatus.ACTIVE,
      },
    });
  });
};
