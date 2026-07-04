import mongoose, { Types } from "mongoose";
import { Cart, ICart, type ICartItem } from "@/models";

export type CartItemInput = {
  product: string;
  quantity: number;
  priceAtAddition: number;
};

export const cartRepository = {
  async getCart(userId: string): Promise<ICart | null> {
    return Cart.findOne({ user: userId }).populate({
      path: "items.product",
      select: "title slug price discountPrice images stock isActive brand",
    });
  },

  async createCart(userId: string): Promise<ICart> {
    return Cart.create({ user: userId, items: [] });
  },

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
    priceAtAddition: number,
  ): Promise<ICart> {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (i: ICartItem) => i.product.toString() === productId,
    );

    if (existingIndex >= 0) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].priceAtAddition = priceAtAddition;
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        quantity,
        priceAtAddition,
      });
    }

    await cart.save();
    return cart;
  },

  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ICart | null> {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return null;

    const item = cart.items.find((i: ICartItem) => i.product.toString() === productId);
    if (!item) return null;

    item.quantity = quantity;
    await cart.save();

    return cart;
  },

  async removeItem(userId: string, productId: string): Promise<ICart | null> {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return null;

    cart.items = cart.items.filter(
      (i: ICartItem) => i.product.toString() !== productId,
    );
    await cart.save();

    return cart;
  },

  async clearCart(userId: string): Promise<ICart | null> {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) return null;

    cart.items = [];
    await cart.save();

    return cart;
  },

  async mergeCart(
    userId: string,
    items: CartItemInput[],
  ): Promise<ICart> {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    for (const incoming of items) {
      const existing = cart.items.find(
        (i: ICartItem) => i.product.toString() === incoming.product,
      );
      if (existing) {
        existing.quantity += incoming.quantity;
        existing.priceAtAddition = incoming.priceAtAddition;
      } else {
        cart.items.push({
          product: new Types.ObjectId(incoming.product),
          quantity: incoming.quantity,
          priceAtAddition: incoming.priceAtAddition,
        });
      }
    }

    await cart.save();
    return cart;
  },
};
