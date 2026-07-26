import { prisma } from "../../lib/prisma";
import { CreateRentalRequestPayload } from "./rental.validation";

const createRentalRequest = async (
  tenantId: string,
  payload: CreateRentalRequestPayload,
) => {
  const propertyExist = await prisma.property.findUniqueOrThrow({
    where: {
      id: payload.propertyId,
    },
  });

  if (propertyExist.availability !== "AVAILABLE") {
    throw new Error("Property Is Not Available");
  }

  const createRequest = await prisma.rentalRequest.create({
    data: {
      ...payload,
      tenantId,
    },
  });
   return createRequest
};

 export const rentalRequestService = {
    createRentalRequest
 }
