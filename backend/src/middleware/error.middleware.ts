import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.statusCode || 500;

  res.status(status).json({
    message: err.message || "Server Error",
  });
};

// export class ApiError extends Error {
//   statusCode: number;

//   constructor(message: string, statusCode = 500) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }
