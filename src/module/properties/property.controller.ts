import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { propertyService } from "./property.service";
import { sendResponse } from "../../utils/sendResponse";
import httpstatus from "http-status";
import {
  createPropertySchema,
  updateAvailabilitySchema,
  updatePropertySchema,
} from "./property.validation";

const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = createPropertySchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.error.flatten().fieldErrors,
      });
    }
    const authorId = req.user?.id as string;
    const property = await propertyService.createPropertiesIntoDB(
      authorId,
      result.data!,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.CREATED,
      message: "Property Created Successfully",
      data: property,
    });
  },
);

const updateproperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = updatePropertySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.error.flatten().fieldErrors,
      });
    }

    const propertyId = req.params?.id as string;
    const authorId = req.user?.id as string;

    const updateproperty = await propertyService.updatePropertyIntoDb(
      propertyId,
      authorId,
      result.data,
    );
    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Property Update Successfully",
      data: updateproperty,
    });
  },
);

const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params?.id as string;
    const authorId = req.user?.id as string;

    const result = await propertyService.deletePropertyIntoDB(
      propertyId,
      authorId,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Property Delete Successfully",
      data: result,
    });
  },
);

const setPropertyStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = updateAvailabilitySchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: result.error.flatten().fieldErrors,
      });
    }
    const propertyId = req.params?.id as string;
    const authorId = req.user?.id as string;

    const updatePropertyStatus = await propertyService.setPropertyStatus(
      propertyId,
      authorId,
      result.data,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "property availability status update Successfully",
      data: updatePropertyStatus,
    });
  },
);

const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const properties = await propertyService.getAllProperties(query);

    sendResponse(res, {
      success: true,
      statusCode: httpstatus.OK,
      message: "Retrieves All Properties Successfully",
      data: properties.data,
      meta: properties.meta,
    });
  },
);

const getSingleProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {

     const propertyId = req.params?.id as string;

     const result = await propertyService.getSingleProperty(propertyId)
     sendResponse(res,{
      success: true,
      statusCode: httpstatus.OK,
      message: 'Get Single Property Successfully',
      data: result
     })
  },
);

export const propertyController = {
  createProperty,
  updateproperty,
  deleteProperty,
  setPropertyStatus,
  getAllProperties,
  getSingleProperty
};
