import mongoose, { Schema, Document, models, Types } from "mongoose";

export interface IWishlistItem {
  product: Types.ObjectId;
}

export interface IWishlist extends Document {
  user: Types.ObjectId;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema<IWishlistItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { _id: false },
);

const WishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [WishlistItemSchema],
  },
  { timestamps: true },
);

export const Wishlist =
  models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema);
