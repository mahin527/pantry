import mongoose, { Schema, Document, models, Types } from "mongoose";

export interface IOrderItem {
  product: Types.ObjectId;
  title: string;
  quantity: number;
  price: number;
  image: string;
}

export interface IShippingAddress {
  fullName: string;
  phone: string;
  country: string;
  city: string;
  area: string;
  street: string;
  postalCode: string;
  label: string;
}

export interface IOrder extends Document {
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
  },
  { _id: false },
);

const ShippingAddressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, default: "" },
    street: { type: String, default: "" },
    postalCode: { type: String, required: true },
    label: { type: String, default: "Home" },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [OrderItemSchema],
    shippingAddress: { type: ShippingAddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true },
);

OrderSchema.index({ user: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order =
  models.Order || mongoose.model<IOrder>("Order", OrderSchema);
