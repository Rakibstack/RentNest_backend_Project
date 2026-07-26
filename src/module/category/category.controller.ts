import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status"
import { categoryService } from "./category.service";


const getAllCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

     const result = await categoryService.getAllCategory()
     sendResponse(res,{
      success: true,
      statusCode: httpstatus.OK,
      message: 'Retrieves All Category Successfully',
      data: result
     })
  },
);

 export const categoryController = {
    getAllCategory
 }