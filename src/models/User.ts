import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  avatarPublicId?: string;
  role: "user" | "admin";
  authProvider: "email" | "google";
  isVerified: boolean;
  emailVerifiedAt?: Date;
  otp?: number;
  otpExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String },
    avatar: { type: String },
    avatarPublicId: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    authProvider: { type: String, enum: ["email", "google"], default: "email" },
    isVerified: { type: Boolean, default: false },
    emailVerifiedAt: { type: Date },
    otp: { type: Number },
    otpExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
);

export const User = models.User || mongoose.model<IUser>("User", UserSchema);
