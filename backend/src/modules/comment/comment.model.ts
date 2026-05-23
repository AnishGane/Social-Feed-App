import mongoose, { Document, Types, Schema } from "mongoose";

interface IComment extends Document {
  post: Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  parentComment?: mongoose.Types.ObjectId | null;
  likesCount: number;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
      index: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null, // for replies (optional future feature)
    },

    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({
  parentComment: 1,
  createdAt: -1,
});

const commentModel = mongoose.model("Comment", commentSchema);
export default commentModel;
