import { ClientSession, Types } from "mongoose";
import bookmarkModel, { IBookmark } from "./bookmark.model";

export const findExistingBookmarkRepo = (
  userId: string | Types.ObjectId,
  postId: string | Types.ObjectId,
  session?: ClientSession,
) => {
  return bookmarkModel
    .findOne({
      user: userId,
      post: postId,
    })
    .session(session || null);
};

export const createBookmarkRepo = (
  data: Partial<IBookmark>,
  session?: ClientSession,
) => {
  return bookmarkModel.create([data], {
    session,
  });
};

export const deleteBookmarkRepo = (
  bookmarkId: string | Types.ObjectId,
  session?: ClientSession,
) => {
  return bookmarkModel.findByIdAndDelete(bookmarkId, { session });
};
