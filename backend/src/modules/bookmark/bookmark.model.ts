import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBookmark extends Document {
  user: Types.ObjectId;
  post: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>(
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
  },
  { timestamps: true },
);

// one bookmark per user per post
bookmarkSchema.index({ user: 1, post: 1 }, { unique: true });

const bookmarkModel = mongoose.model<IBookmark>("Bookmark", bookmarkSchema);

export default bookmarkModel;
