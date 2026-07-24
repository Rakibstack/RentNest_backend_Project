import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IcreateUser } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: IcreateUser) => {
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
    }
  });

  return user;
};

 const getMyProfile = async (userId: string) => {

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    })

     return user;
 }

export const userService = {
  createUserIntoDB,
  getMyProfile
};
