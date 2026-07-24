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
    const {accessToken,refreshToken} = await authService.loginUser(result.data);

    res.cookie("accessToken",accessToken,{
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24  // 24 h or 1d
    })

    res.cookie("refreshToken",refreshToken,{
        httpOnly: true,
        secure: false,
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7d
    })

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "User Login Successfully",
      data: {
        accessToken,
        refreshToken
      },
    });
  },
);


 export const authController = {
    loginUser
 }
