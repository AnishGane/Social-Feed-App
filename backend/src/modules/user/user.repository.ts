import { Types } from "mongoose";
import User from "./user.model";
import { UpdateProfileInput } from "./user.validation";

export const findUserByIdRepo = (userId: string | Types.ObjectId) => {
  return User.findById(userId);
};

export const findUserByUsernameRepo = (username: string) => {
  return User.findOne({
    username,
  });
};

export const updateUserRepo = (
  userId: string | Types.ObjectId,
  data: UpdateProfileInput,
) => {
  return User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });
};
