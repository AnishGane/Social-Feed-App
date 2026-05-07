import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPost extends Document {
  author: Types.ObjectId;
  title: string;
  content: string;
  thumbnailImage?: string;
  mainImage?: string;
  tags?: string[];

  upvotesCount: number;
  downvotesCount: number;
  commentCount: number;
  score: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 100,
    },

    content: {
      type: String,
      required: true,
    },

    thumbnailImage: {
      type: String,
      default: "",
    },

    mainImage: {
      type: String,
      default: "",
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    upvotesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    downvotesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    score: {
      type: Number,
      default: 0, // upvotesCount - downvotesCount
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

postSchema.pre("save", function () {
  this.score = this.upvotesCount - this.downvotesCount;
});

postSchema.index({ createdAt: -1 });
const postModel = mongoose.model("Post", postSchema);

export default postModel;
