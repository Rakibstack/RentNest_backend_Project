import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { adminService } from "./admin.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";
import { createUpdateUserStatusSchema } from "./admin.validation";

const getAllUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllUserFromDB();
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Retrieve All Users Successfully ",
      data: result,
    });
  },
);
const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = createUpdateUserStatusSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.error.flatten().fieldErrors,
      });
    }
    const userId = req.params?.id as string;
    const updateUser = await adminService.updateUserStatus(userId, result.data);
    sendResponse(res,{
        success: true,
        statusCode: httpstatus.OK,
        message: "Update User Status Successfully",
        data: updateUser
    })
  },
);

export const adminController = {
  getAllUser,
  updateUserStatus
};
