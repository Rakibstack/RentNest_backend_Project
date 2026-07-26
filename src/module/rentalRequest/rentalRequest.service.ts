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
  return createRequest;
};

const getUserRentalRequest = async (tenantId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      tenantId,
    },
    include: {
      property: {
        select: {
          title: true,
          description: true,
          location: true,
          rent: true,
        },
      },
    },
  });
  return result;
};
const getSingleRentalRequest = async (rentalId: string) => {
  const result = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalId,
    },
    include: {
      property: {
        select: {
          title: true,
          description: true,
          location: true,
          rent: true,
          availability: true,
        },
      },
    },
  });
  if (!result) {
    throw new Error("Rental Request Not Found");
  }

  return result;
};
export const rentalRequestService = {
  createRentalRequest,
  getUserRentalRequest,
  getSingleRentalRequest,
};
