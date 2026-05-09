// 1 user = 1 vote per post (enforced by unique index)

import mongoose, { Document, Types, Schema } from "mongoose";

export interface IVote extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;

  type: "up" | "down";

  createdAt: Date;
  updatedAt: Date;
}

const voteSchema = new Schema<IVote>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["up", "down"],
      required: true,
    },
  },
  { timestamps: true },
);

// ensures one vote per user per post
voteSchema.index({ user: 1, post: 1 }, { unique: true });

const voteModel = mongoose.model("Vote", voteSchema);
export default voteModel;
