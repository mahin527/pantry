import mongoose, { Schema, Document, models, Types } from "mongoose";

export interface IAddress extends Document {
  user: Types.ObjectId;
  fullName: string;
  phone: string;
  country: string;
  city: string;
  area: string;
  street: string;
  postalCode: string;
  label: "Home" | "Office" | "Other";
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, default: "" },
    street: { type: String, default: "" },
    postalCode: { type: String, required: true },
    label: {
      type: String,
      enum: ["Home", "Office", "Other"],
      default: "Home",
    },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true },
);

AddressSchema.index({ user: 1 });
AddressSchema.index({ user: 1, isDefault: 1 });

export const Address =
  models.Address || mongoose.model<IAddress>("Address", AddressSchema);
