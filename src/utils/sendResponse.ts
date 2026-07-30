import { Response } from "express";

type Tmeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

type Tresponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: Tmeta;
};

export const sendResponse = <T>(res: Response, data: Tresponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};
