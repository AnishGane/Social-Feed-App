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

export const searchUsersRepo = (
  currentUserId: string | Types.ObjectId,
  search: string,
) => {
  return User.find({
    _id: {
      $ne: currentUserId,
    },

    $or: [
      {
        username: {
          $regex: search,
          $options: "i",
        },
      },
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  })
    .select("_id username name")
    .limit(10);
};
