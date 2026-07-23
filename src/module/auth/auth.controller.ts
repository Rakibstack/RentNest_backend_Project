import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { loginSchema } from "./auth.validation";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";

const loginUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const user = await authService.loginUser(result.data);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "User Login Successfully",
      data: user,
    });
  },
);


 export const authController = {
    loginUser
 }
