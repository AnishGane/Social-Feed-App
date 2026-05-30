import mongoose, { Schema, Types, Document } from "mongoose";

export interface IFollow extends Document {
  follower: Types.ObjectId;
  following: Types.ObjectId;
}

const followSchema = new Schema<IFollow>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

followSchema.index(
  {
    follower: 1,
    following: 1,
  },
  {
    unique: true,
  },
);
followSchema.index({ following: 1 });
followSchema.index({ follower: 1 });

const followModel = mongoose.model<IFollow>("Follow", followSchema);
export default followModel;
