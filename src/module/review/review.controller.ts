import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { reviewService } from "./review.service";
import { createReviewValidationSchema } from "./review.validation";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status"

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = createReviewValidationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const userId = req.user?.id as string;
    const review = await reviewService.createReviewIntoDB(result.data, userId);
    sendResponse(res,{
        success: true,
        statusCode:httpstatus.CREATED,
        message: 'Created Review Successfully',
        data: review
    })
  },
);

 export const reviewController = {
    createReview
 }
