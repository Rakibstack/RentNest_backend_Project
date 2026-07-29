import { RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { createReviewValidationPayload } from "./review.validation";

const createReviewIntoDB = async (
  payload: createReviewValidationPayload,
  userId: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: payload.rentalRequestId,
    },
    include: {
      review: true,
    },
  });

  if (!rentalRequest) {
    throw new Error("Rental Request Not Found");
  }

  if (rentalRequest.tenantId !== userId) {
    throw new Error("You are not authorized to review this rental.");
  }

  if (rentalRequest.status !== RentalRequestStatus.COMPLETED) {
    throw new Error("You can only review a completed rental.");
  }

  if (rentalRequest.review) {
    throw new Error("You have already reviewed this rental.");
  }

   const createReview = await prisma.review.create({
    data: {
        rentalRequestId: payload.rentalRequestId,
        comment: payload.comment,
        rating: payload.rating
    }
   })

   return createReview
};

 export const reviewService = {
  createReviewIntoDB
 }
