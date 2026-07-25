import { tr } from "zod/locales";
import { prisma } from "../../lib/prisma";
import {
  CreatePropertyPayload,
  UpdateAvailabilityPayload,
  updatePropertyPayload,
} from "./property.validation";
import { PropertyStatus } from "../../../generated/prisma/enums";

const createPropertiesIntoDB = async (
  authorId: string,
  payload: CreatePropertyPayload,
) => {
  const createProperty = await prisma.property.create({
    data: {
      ...payload,
      authorId,
    },
  });

  return createProperty;
};

const updatePropertyIntoDb = async (
  propertyId: string,
  authorId: string,
  payload: updatePropertyPayload,
) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId,
    },
  });

  if (property.authorId !== authorId) {
    throw new Error("You Are Not The Owner Of This Property.");
  }

  const updateProperty = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: payload,
  });

  return updateProperty;
};

const deletePropertyIntoDB = async (propertyId: string, authorId: string) => {
  const propertyExists = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId,
    },
  });

  if (propertyExists.authorId !== authorId) {
    throw new Error("You Are Not The Owner Of This Property");
  }

  const result = await prisma.property.delete({
    where: {
      id: propertyId,
    },
  });
  return result;
};

const setPropertyStatus = async (
  propertyId: string,
  authorId: string,
  payload: UpdateAvailabilityPayload,
) => {
  const propertyExist = await prisma.property.findUniqueOrThrow({
    where: {
      id: propertyId,
    },
  });

  if (propertyExist.authorId !== authorId) {
    throw new Error("You Are Not The Owner Of This Property");
  }

  const result = await prisma.property.update({
    where: {
      id: propertyId,
    },
    data: {
      availability:payload.availability
    },
  });
  return result;
};

export const propertyService = {
  createPropertiesIntoDB,
  updatePropertyIntoDb,
  deletePropertyIntoDB,
  setPropertyStatus,
};
