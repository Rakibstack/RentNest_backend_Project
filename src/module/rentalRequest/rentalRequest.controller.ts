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

 export const rentalRequestController = {
    createRentalRequest
 }
