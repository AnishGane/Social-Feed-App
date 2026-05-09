import { Types } from "mongoose";
import { ApiError } from "./api-error";

export const validateObjectId = (
  id: string,
  field = "Resource",
): Types.ObjectId => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(`Invalid ${field} ID`, 400);
  }

  return new Types.ObjectId(id);
};
