import { prisma } from "../../lib/prisma";
import { createUpdateUserStatusPayload } from "./admin.validation";

const getAllUserFromDB = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return users;
};

const updateUserStatus = async (
  userId: string,
  payload: createUpdateUserStatusPayload,
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User Not Found");
  }

  const updateUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      status: payload.status,
    },
    omit: {
      password: true,
    },
  });
  return updateUser;
};

const getAllProperties = async () => {
  const result = await prisma.property.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return result;
};
const getAllRentalRequest = async () => {
  const result = await prisma.rentalRequest.findMany({
    include: {
      property: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });
    return result
};

export const adminService = {
  getAllUserFromDB,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequest
};
