import { ClientSession, Types } from "mongoose";
import voteModel, { IVote } from "./vote.model";

export const findExistingVoteRepo = (
  userId: string | Types.ObjectId,
  postId: string | Types.ObjectId,
  session?: ClientSession,
) => {
  return voteModel
    .findOne({ user: userId, post: postId })
    .session(session || null);
};

export const createVoteRepo = (
  data: Partial<IVote>,
  session?: ClientSession,
) => {
  return voteModel.create([data], { session });
};

export const updateVoteRepo = (
  voteId: string | Types.ObjectId,
  type: "up" | "down",
  session?: ClientSession,
) => {
  return voteModel.findByIdAndUpdate(voteId, { type }, { new: true, session });
};

export const deleteVoteRepo = (
  voteId: string | Types.ObjectId,
  session?: ClientSession,
) => {
  return voteModel.findByIdAndDelete(voteId, { session });
};
