import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";
import { createUserSchema } from "./user.validation";

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = createUserSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.error.flatten().fieldErrors,
      });
    }
    const user = await userService.createUserIntoDB(result.data!);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "User Created Successfully",
      data: user,
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
     
     const userId = req.user?.id

     const user = await userService.getMyProfile(userId as string)
     sendResponse(res,{
        success:true,
        statusCode: httpstatus.OK,
        message: 'User Profile Fatched Successfully',
        data: user
     })
  },
);

export const userController = {
  createUser,
  getMyProfile
};
