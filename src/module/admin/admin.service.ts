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
   return updateUser
};

export const adminService = {
  getAllUserFromDB,
  updateUserStatus
};

