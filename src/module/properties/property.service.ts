import { prisma } from "../../lib/prisma";
import {
  CreatePropertyPayload,
  UpdateAvailabilityPayload,
  updatePropertyPayload,
} from "./property.validation";
import { IpropertyQuery } from "./property.interface";
import { PropertyWhereInput } from "../../../generated/prisma/models";

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
      availability: payload.availability,
    },
  });
  return result;
};

const getAllProperties = async (query: IpropertyQuery) => {
  const limit = query.limit ? Number(query.limit) : 5;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const addConditions: PropertyWhereInput[] = [];

  if (query.searchTerm) {
    addConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.minRent || query.maxRent) {
    addConditions.push({
      rent: {
        ...(query.minRent && {
          gte: Number(query.minRent),
        }),
        ...(query.maxRent && {
          lte: Number(query.maxRent),
        }),
      },
    });
  }
  if (query.location) {
    addConditions.push({
      location: query.location,
    });
  }
  if (query.categoryId) {
    addConditions.push({
      categoryId: query.categoryId,
    });
  }
  addConditions.push({
    availability: "AVAILABLE",
  });

  const totalProperty = await prisma.property.count({
    where: {
      AND: addConditions,
    },
  });

  const properties = await prisma.property.findMany({
    where: {
      AND: addConditions,
    },
    take: limit,
    skip: skip,
    orderBy: {
      createdAt: "desc",
    },
  });
  return {
    data: properties,
    meta: {
      page: page,
      limit: limit,
      total: totalProperty,
      totalPage: Math.ceil(totalProperty / limit),
    },
  };
};

const getSingleProperty = async (propertyId: string) => {
  const property = prisma.property.findFirstOrThrow({
    where: {
      id: propertyId,
      availability: "AVAILABLE",
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
  return property;
};

const getAllLandlordPropertyRequest = async (landlordId: string) => {
  const result = await prisma.rentalRequest.findMany({
    where: {
      property : {
        authorId : landlordId
      }
    },
    // include: {
    //   author: true
    // }
  });
  return result;
};

export const propertyService = {
  createPropertiesIntoDB,
  updatePropertyIntoDb,
  deletePropertyIntoDB,
  setPropertyStatus,
  getAllProperties,
  getSingleProperty,
  getAllLandlordPropertyRequest
};
