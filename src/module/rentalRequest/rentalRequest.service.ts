import { RentalRequestStatus } from "../../../generated/prisma/enums";
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
const updateRentalRequestCompleteStatus = async (
  userId: string,
  rentalRequestId: string,
) => {

  const rentalRequest = await prisma.rentalRequest.findUniqueOrThrow({
    where: {
      id: rentalRequestId
    },include: {
      property: true
    }
  })
  if(!rentalRequest){
    throw new Error('Rental Request Not Found')
  }
  if(rentalRequest.property.authorId !== userId){
    throw new Error('You Are Not The Owner Of This Rental Properties')
  }
  if(rentalRequest.status === RentalRequestStatus.COMPLETED){
    throw new Error('Rental Request Already Completed')
  }
  const updateStatus = await prisma.rentalRequest.update({
    where: {
      id: rentalRequestId,
      property:{
        authorId : userId
      }
    },
    data: {
      status: RentalRequestStatus.COMPLETED
    }
  })
  return updateStatus;
};
export const rentalRequestService = {
  createRentalRequest,
  getUserRentalRequest,
  getSingleRentalRequest,
  updateRentalRequestCompleteStatus
};
