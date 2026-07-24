import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

 const createToken = (
  payload: JwtPayload,
  secret: string,
  expireIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expireIn,
  } as SignOptions);
  return token;
};

 const verifyToken = (access: string, secret: string) => {
  try {
    const verifyToken = jwt.verify(access, secret);
    return {
      success: true,
      data: verifyToken,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

 export const jwtUtils = {
    createToken,
    verifyToken
 }
