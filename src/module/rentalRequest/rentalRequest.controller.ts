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
    const result = await rentalRequestService.getUserRentalRequest(tenantId);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Retrieves User All Rental Request",
      data: result,
    });
  },
);

const getSingleRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const rentalId = req.params?.id as string;
    const result = await rentalRequestService.getSingleRentalRequest(rentalId);
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Get Single Rental Request Successfully",
      data: result,
    });
  },
);
const updateRentalRequestCompleteStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const rentalRequestId = req.params?.id as string;

    const result = await rentalRequestService.updateRentalRequestCompleteStatus(
      userId,
      rentalRequestId,
    );
    sendResponse(res,{
      success: true,
      statusCode: httpstatus.OK,
      message: 'Rental Request Status Update Successfully',
      data: result
    })
  },
);

export const rentalRequestController = {
  createRentalRequest,
  getUserRentalRequest,
  getSingleRentalRequest,
  updateRentalRequestCompleteStatus
};
