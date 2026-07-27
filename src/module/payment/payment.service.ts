import { RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

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

  return {
    rentalRequest,
    amount
  }
};

export const paymentService = {
    createPaymentSession
}
