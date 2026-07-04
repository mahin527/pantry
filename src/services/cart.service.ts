import { connectDB } from "@/lib/db";
import { cartRepository } from "@/repositories/cart.repository";
import { Product } from "@/models";
import { success, error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import type { ApiResponse } from "@/types/common";
import type { ICart } from "@/models";

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
    await connectDB();

    const product = await Product.findById(productId).select(
      "title price discountPrice images stock isActive brand slug",
    );
    if (!product) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }
    if (!product.isActive) {
      return error(MESSAGES.PRODUCT_INACTIVE);
    }
    if (product.stock < 1) {
      return error(MESSAGES.PRODUCT_OUT_OF_STOCK);
    }

    const cart = await cartRepository.getCart(userId);
    let currentQty = 0;
    if (cart) {
      const existing = cart.items.find(
        (i) => i.product.toString() === productId,
      );
      if (existing) {
        currentQty = existing.quantity;
      }
    }

    const newQty = currentQty + quantity;
    if (newQty > product.stock) {
      return error(MESSAGES.QUANTITY_EXCEEDS_STOCK);
    }

    const effectivePrice = product.discountPrice ?? product.price;
    await cartRepository.addItem(userId, productId, quantity, effectivePrice);

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
    await connectDB();

    if (quantity < 1) {
      return error("Quantity must be at least 1");
    }

    const product = await Product.findById(productId).select("stock");
    if (!product) {
      return error(MESSAGES.PRODUCT_NOT_FOUND);
    }
    if (quantity > product.stock) {
      return error(MESSAGES.QUANTITY_EXCEEDS_STOCK);
    }

    const updated = await cartRepository.updateQuantity(
      userId,
      productId,
      quantity,
    );
    if (!updated) {
      return error(MESSAGES.CART_NOT_FOUND);
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
    items: Array<{ product: string; quantity: number; priceAtAddition: number }>,
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
