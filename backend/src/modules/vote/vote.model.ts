// 1 user = 1 vote per post (enforced by unique index)

import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    post: {
      type: mongoose.Schema.Types.ObjectId,
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
