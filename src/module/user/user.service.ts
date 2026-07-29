import config from "../../config";
import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import {
  createUpdateProfilePayload,
  createUserPayload,
} from "./user.validation";

const createUserIntoDB = async (payload: createUserPayload) => {
  const { name, email, password, phone, profileImage, role } = payload;

  const userExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (userExist) {
    throw new Error("User Already Exist");
  }

  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );

  const createUser = await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: hashPassword,
      role: role,
      phone: phone,
      profileImage: profileImage,
    },
  });
  const user = await prisma.user.findUnique({
    where: {
      email: createUser.email,
      id: createUser.id,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
  });

  return user;
};
const manageUserProfile = async (
  userId: string,
  payload: createUpdateProfilePayload,
) => {
  const { name, phone, profileImage } = payload;

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      phone,
      profileImage,
    },
    omit: {
      password : true
    }
  });
   return result;
};

export const userService = {
  createUserIntoDB,
  getMyProfile,
  manageUserProfile
};
