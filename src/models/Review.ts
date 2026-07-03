import mongoose, { Schema, Document, models, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId;
  product: Types.ObjectId;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ReviewSchema.index({ product: 1 });
ReviewSchema.index({ user: 1 });
ReviewSchema.index({ product: 1, isApproved: 1 });

export const Review =
  models.Review || mongoose.model<IReview>("Review", ReviewSchema);
