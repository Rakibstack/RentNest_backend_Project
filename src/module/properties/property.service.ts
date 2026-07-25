import { tr } from "zod/locales";
import { prisma } from "../../lib/prisma";
import {
  CreatePropertyPayload,
  updatePropertyPayload,
} from "./property.validation";

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

    const property= await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId
        }
    })

    if(property.authorId !== authorId){
        throw new Error('You Are Not The Owner Of This Property.')
    }

    const updateProperty = await prisma.property.update({
        where:{
            id: propertyId
        },
        data:payload,
    })

    return updateProperty;
};

export const propertyService = {
  createPropertiesIntoDB,
  updatePropertyIntoDb
};
