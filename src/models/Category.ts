import mongoose, { Schema, Document, models } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  image: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

CategorySchema.index({ slug: 1 });
CategorySchema.index({ isActive: 1, sortOrder: 1 });

export const Category =
  models.Category || mongoose.model<ICategory>("Category", CategorySchema);
