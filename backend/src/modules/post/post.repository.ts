// DB Queries all here

import { Types } from "mongoose";
import postModel, { IPost } from "./post.model";

export const createPostRepo = (data: Partial<IPost>) => postModel.create(data);

export const updatePostRepo = (
  id: string | Types.ObjectId,
  data: Partial<IPost>,
): Promise<IPost | null> =>
  postModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deletePostRepo = (id: string | Types.ObjectId) =>
  postModel.findByIdAndDelete(id);

export const findPostByIdRepo = (id: string | Types.ObjectId) =>
  postModel.findById(id);

export const getPostsRepo = (skip = 0, limit = 10): Promise<IPost[]> =>
  postModel
    .find({ isPublished: true })
    .populate("author", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
