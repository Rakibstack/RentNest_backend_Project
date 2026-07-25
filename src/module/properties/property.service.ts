import { prisma } from "../../lib/prisma";
import { CreatePropertyPayload } from "./property.validation";

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

export const propertyService = {
  createPropertiesIntoDB,
};
