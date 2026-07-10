import mongoose, { Schema, Document, models, Types } from "mongoose";

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: Types.ObjectId;
  images: string[];
  price: number;
  discountPrice?: number;
  stock: number;
  sku: string;
  brand?: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isPopular: boolean;
  isLatest: boolean;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sku: { type: String, required: true, unique: true },
    brand: { type: String, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isLatest: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String, trim: true }],
  },
  { timestamps: true },
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ isFeatured: 1, isActive: 1 });
ProductSchema.index({ isPopular: 1, isActive: 1 });
ProductSchema.index({ isLatest: 1, isActive: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });

export const Product =
  models.Product || mongoose.model<IProduct>("Product", ProductSchema);
