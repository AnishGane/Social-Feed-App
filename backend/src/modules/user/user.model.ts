import mongoose, { Document, Types } from "mongoose";
import bcrypt from "bcryptjs";
import { isValidSocialLinkUrl } from "../../utils/is-valid-social-link";

export interface IUser extends Document {
  _id: Types.ObjectId;

  username: string;
  email: string;
  password: string;
  avatar?: string;

  refreshToken?: string;
  comparePassword(candidate: string): Promise<boolean>;

  name?: string;
  bio?: string;
  socialLinks?: {
    website?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const urlValidator = {
  validator: isValidSocialLinkUrl,
  message: "Invalid URL format",
};

const userSchema = new mongoose.Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    refreshToken: {
      type: String,
      default: null,
    },

    name: {
      type: String,
      trim: true,
      default: "",
      maxlength: 50,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 160,
      default: "",
    },

    socialLinks: {
      website: {
        type: String,
        default: "",
        validate: urlValidator,
      },

      github: {
        type: String,
        default: "",
        validate: urlValidator,
      },

      linkedin: {
        type: String,
        default: "",
        validate: urlValidator,
      },

      twitter: {
        type: String,
        default: "",
        validate: urlValidator,
      },

      instagram: {
        type: String,
        default: "",
        validate: urlValidator,
      },

      youtube: {
        type: String,
        default: "",
        validate: urlValidator,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Password hashing (pre-save hook)
userSchema.pre("save", async function () {
  const user = this as IUser;

  if (!user.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

//  Password comparison method
userSchema.methods.comparePassword = async function (
  candidate: string,
): Promise<boolean> {
  return await bcrypt.compare(candidate, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
