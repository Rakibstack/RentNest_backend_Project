import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { rentalRequestService } from "./rentalRequest.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus, { status } from "http-status";
import { createRentalRequestSchema } from "./rental.validation";

const createRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = createRentalRequestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const tenantId = req.user?.id as string;
    const createRentalRequest = await rentalRequestService.createRentalRequest(
      tenantId,
      result.data,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "Rental Request Created Successfully",
      data: createRentalRequest,
    });
  },
);
const getUserRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const tenantId = req.user?.id as string;
    const result = await rentalRequestService.getUserRentalRequest(tenantId)
    sendResponse(res,{
        success: true,
        statusCode: httpstatus.OK,
        message: 'Retrieves User All Rental Request',
        data: result
    })
  },
);

export const rentalRequestController = {
  createRentalRequest,
  getUserRentalRequest
};
