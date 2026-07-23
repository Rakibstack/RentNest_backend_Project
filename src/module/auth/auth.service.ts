import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt, {  SignOptions } from "jsonwebtoken";
import config from "../../config";

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const matchPassword = await bcrypt.compare(password, user.password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }

  const jwtpayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
  const accessToken = jwt.sign(
    jwtpayload,
    config.jwt_access_secret as string,
    {expiresIn: config.jwt_access_expire_in} as SignOptions,
  );
  const refreshToken = jwt.sign(
    jwtpayload,
    config.jwt_refresh_secret as string,
    {expiresIn:  config.jwt_refresh_expire_in} as SignOptions,
  );

  return {
    accessToken,
    refreshToken
  }
};


 export const authService = {
    loginUser,
 }
