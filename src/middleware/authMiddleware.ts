import { NextFunction, Request, Response } from "express";
import { Role } from "../../generated/prisma/enums";
import { catchAsync } from "../utils/catchAsync";
import config from "../config";
import { jwtUtils } from "../utils/jwtUtils";
import { JwtPayload } from "jsonwebtoken";
import { prisma } from "../lib/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authMiddleware = (...requiredRole: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    if (!token) {
      throw new Error(
        "you are not logged in. please log in to access this resource",
      );
    }
    const verifyToken = jwtUtils.verifyToken(
      token,
      config.jwt_access_secret as string,
    );

    if (!verifyToken.success) {
      throw new Error(verifyToken.error);
    }
    const { id, name, email, role } = verifyToken.data as JwtPayload;

    if (requiredRole.length && !requiredRole.includes(role)) {
      throw new Error(
        "Forbidden Access.you dont have permission to access this resource.",
      );
    }

    const user = await prisma.user.findUniqueOrThrow({
      where: {
        id,
        name,
        email,
        role,
      },
    });

    if (user.status !== "ACTIVE") {
      throw new Error("your account has been banned,please contact support");
    }

    req.user = {
      id,
      name,
      email,
      role,
    };

    next();
  });
};
