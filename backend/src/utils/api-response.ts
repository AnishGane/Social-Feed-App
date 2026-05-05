import { Response } from "express";

export const sendResponse = (
  res: Response,
  statusCode: number,
  data: any = null,
  message: string = "success",
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
