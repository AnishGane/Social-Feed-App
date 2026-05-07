// DB Queries all here

import postModel, { IPost } from "./post.model";

export const createPostRepo = (data: Partial<IPost>) => postModel.create(data);

export const updatePostRepo = (
  id: string,
  data: Partial<IPost>,
): Promise<IPost | null> =>
  postModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deletePostRepo = (id: string) => postModel.findByIdAndDelete(id);

export const findPostByIdRepo = (id: string) => postModel.findById(id);

export const getPostsRepo = (skip = 0, limit = 10): Promise<IPost[]> =>
  postModel
    .find({ isPublished: true })
    .populate("author", "name avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
