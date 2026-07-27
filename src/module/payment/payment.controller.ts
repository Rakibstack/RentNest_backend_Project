import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { createPaymentValidationSchema } from "./payment.validation";
import { paymentService } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";

const createPaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

    const result = createPaymentValidationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.error.flatten().fieldErrors,
      });
    }
    const userId = req.user?.id as string;
    const session = await paymentService.createPaymentSession(
      userId,
      result.data.rentalRequestId,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "Payment Session Created Successfully",
      data: session,
    });
  },
);

 export const paymentController = {
    createPaymentSession
 }
