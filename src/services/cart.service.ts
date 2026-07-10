import { connectDB } from "@/lib/db";
import { cartRepository } from "@/repositories/cart.repository";
import { Product, Cart } from "@/models";
import { Types } from "mongoose";
import { success, error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import type { ApiResponse } from "@/types/common";
import type { ICart, ICartItem } from "@/models";

type CartItemResponse = {
  productId: string;
  title: string;
  slug: string;
  image: string;
  brand: string;
  price: number;
  discountPrice: number | null;
  quantity: number;
  subtotal: number;
};

type CartResponse = {
  items: CartItemResponse[];
  subtotal: number;
  itemCount: number;
};

function toCartResponse(cart: ICart): CartResponse {
  const items: CartItemResponse[] = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = item.product as unknown as {
      _id: { toString(): string };
      title: string;
      slug: string;
      price: number;
      discountPrice?: number;
      images: string[];
      stock: number;
      isActive: boolean;
      brand?: string;
    };

    const effectivePrice = product.discountPrice ?? product.price;
    const lineSubtotal = effectivePrice * item.quantity;
    subtotal += lineSubtotal;

    items.push({
      productId: product._id.toString(),
      title: product.title,
      slug: product.slug,
      image: product.images?.[0] ?? "/potato-chips-1.jpg",
      brand: product.brand ?? "",
      price: product.price,
      discountPrice: product.discountPrice ?? null,
      quantity: item.quantity,
      subtotal: lineSubtotal,
    });
  }

  return { items, subtotal, itemCount: items.length };
}

export const cartService = {
  async getCart(userId: string): Promise<ApiResponse<CartResponse>> {
    await connectDB();

    const cart = await cartRepository.getCart(userId);
    if (!cart || cart.items.length === 0) {
      return success({ items: [], subtotal: 0, itemCount: 0 }, MESSAGES.CART_FETCHED);
    }

    return success(toCartResponse(cart), MESSAGES.CART_FETCHED);
  },

  async addItem(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ApiResponse<CartResponse>> {
    const mongooseInstance = await connectDB();

    const session = await mongooseInstance.startSession();
    session.startTransaction();

    try {
      const product = await Product.findById(productId)
        .select("title price discountPrice images stock isActive brand slug")
        .session(session);
      if (!product) {
        await session.abortTransaction();
        return error(MESSAGES.PRODUCT_NOT_FOUND);
      }
      if (!product.isActive) {
        await session.abortTransaction();
        return error(MESSAGES.PRODUCT_INACTIVE);
      }
      if (product.stock < 1) {
        await session.abortTransaction();
        return error(MESSAGES.PRODUCT_OUT_OF_STOCK);
      }

      let cart = await Cart.findOne({ user: userId }).session(session);
      if (!cart) {
        cart = new Cart({ user: userId, items: [] });
      }

      let currentQty = 0;
      const existing = cart.items.find(
        (i: ICartItem) => i.product.toString() === productId,
      );
      if (existing) {
        currentQty = existing.quantity;
      }

      const newQty = currentQty + quantity;
      if (newQty > product.stock) {
        await session.abortTransaction();
        return error(MESSAGES.QUANTITY_EXCEEDS_STOCK);
      }

      if (existing) {
        existing.quantity += quantity;
      } else {
        cart.items.push({ product: new Types.ObjectId(productId), quantity });
      }

      await cart.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    const populated = await cartRepository.getCart(userId);
    return success(
      populated ? toCartResponse(populated) : { items: [], subtotal: 0, itemCount: 0 },
      MESSAGES.CART_ITEM_ADDED,
    );
  },

  async updateQuantity(
    userId: string,
    productId: string,
    quantity: number,
  ): Promise<ApiResponse<CartResponse>> {
    const mongooseInstance = await connectDB();

    if (quantity < 1) {
      return error("Quantity must be at least 1");
    }

    const session = await mongooseInstance.startSession();
    session.startTransaction();

    try {
      const product = await Product.findById(productId)
        .select("stock")
        .session(session);
      if (!product) {
        await session.abortTransaction();
        return error(MESSAGES.PRODUCT_NOT_FOUND);
      }
      if (quantity > product.stock) {
        await session.abortTransaction();
        return error(MESSAGES.QUANTITY_EXCEEDS_STOCK);
      }

      const cart = await Cart.findOne({ user: userId }).session(session);
      if (!cart) {
        await session.abortTransaction();
        return error(MESSAGES.CART_NOT_FOUND);
      }

      const item = cart.items.find((i: ICartItem) => i.product.toString() === productId);
      if (!item) {
        await session.abortTransaction();
        return error(MESSAGES.CART_NOT_FOUND);
      }

      item.quantity = quantity;
      await cart.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }

    const populated = await cartRepository.getCart(userId);
    return success(
      populated ? toCartResponse(populated) : { items: [], subtotal: 0, itemCount: 0 },
      MESSAGES.CART_ITEM_UPDATED,
    );
  },

  async removeItem(
    userId: string,
    productId: string,
  ): Promise<ApiResponse<CartResponse>> {
    await connectDB();

    const updated = await cartRepository.removeItem(userId, productId);
    if (!updated) {
      return error(MESSAGES.CART_NOT_FOUND);
    }

    const populated = await cartRepository.getCart(userId);
    return success(
      populated ? toCartResponse(populated) : { items: [], subtotal: 0, itemCount: 0 },
      MESSAGES.CART_ITEM_REMOVED,
    );
  },

  async clearCart(userId: string): Promise<ApiResponse<CartResponse>> {
    await connectDB();

    await cartRepository.clearCart(userId);

    return success(
      { items: [], subtotal: 0, itemCount: 0 },
      MESSAGES.CART_CLEARED,
    );
  },

  async mergeCart(
    userId: string,
    items: Array<{ product: string; quantity: number }>,
  ): Promise<ApiResponse<CartResponse>> {
    await connectDB();

    await cartRepository.mergeCart(userId, items);

    const populated = await cartRepository.getCart(userId);
    return success(
      populated ? toCartResponse(populated) : { items: [], subtotal: 0, itemCount: 0 },
      MESSAGES.CART_ITEM_ADDED,
    );
  },
};
