import { connectDB } from "@/lib/db";
import { orderRepository, type AdminOrderFilter } from "@/repositories/order.repository";
import { cartRepository } from "@/repositories/cart.repository";
import { addressRepository } from "@/repositories/address.repository";
import { Product, Cart } from "@/models";
import { success, error } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import { calculatePagination } from "@/lib/pagination";
import { calculateSkip } from "@/lib/query";
import type { ApiResponse, Pagination } from "@/types/common";
import type { IOrder, IOrderItem } from "@/models";

type OrderResponse = {
  order: IOrder;
};

type PaginatedOrders = {
  orders: IOrder[];
  pagination: Pagination;
};

export const orderService = {
  async createOrder(
    userId: string,
    addressId: string,
    paymentMethod: "cod" | "card" = "cod",
    paymentIntentId?: string,
  ): Promise<ApiResponse<OrderResponse>> {
    const mongooseInstance = await connectDB();

    const address = await addressRepository.getById(userId, addressId);
    if (!address) {
      return error(MESSAGES.ADDRESS_NOT_FOUND);
    }

    const populatedCart = await cartRepository.getCart(userId);
    if (!populatedCart || populatedCart.items.length === 0) {
      return error(MESSAGES.CART_EMPTY);
    }

    const orderItems: IOrderItem[] = [];
    let subtotal = 0;

    for (const item of populatedCart.items) {
      const product = item.product as unknown as {
        _id: { toString(): string };
        title: string;
        price: number;
        discountPrice?: number;
        images: string[];
        stock: number;
        isActive: boolean;
      };

      if (!product) {
        return error(MESSAGES.PRODUCT_NOT_FOUND);
      }
      if (!product.isActive) {
        return error(MESSAGES.PRODUCT_INACTIVE);
      }
      if (product.stock < item.quantity) {
        return error(MESSAGES.INSUFFICIENT_STOCK);
      }

      const effectivePrice = product.discountPrice ?? product.price;
      subtotal += effectivePrice * item.quantity;

      orderItems.push({
        product: product._id as unknown as import("mongoose").Types.ObjectId,
        title: product.title,
        quantity: item.quantity,
        price: effectivePrice,
        image: product.images?.[0] ?? "",
      });
    }

    const shippingFee = subtotal >= 100 ? 0 : 5.99;
    const discount = 0;
    const total = subtotal + shippingFee - discount;

    const session = await mongooseInstance.startSession();
    session.startTransaction();

    try {
      const order = await orderRepository.create(
        {
          user: userId as unknown as import("mongoose").Types.ObjectId,
          items: orderItems,
          shippingAddress: {
            fullName: address.fullName,
            phone: address.phone,
            country: address.country,
            city: address.city,
            area: address.area ?? "",
            street: address.street ?? "",
            postalCode: address.postalCode,
            label: address.label,
          },
          subtotal,
          shippingFee,
          discount,
          total,
          paymentMethod,
          paymentIntentId,
          paymentStatus: paymentMethod === "card" ? "paid" : "pending",
          orderStatus: "pending",
        },
        session,
      );

      for (const item of orderItems) {
        await Product.updateOne(
          { _id: item.product },
          { $inc: { stock: -item.quantity } },
          { session },
        );
      }

      await Cart.deleteOne({ user: userId }, { session });

      await session.commitTransaction();
      session.endSession();

      const populatedOrder = await orderRepository.findById(
        order._id.toString(),
      );

      return success(
        { order: populatedOrder ?? order },
        MESSAGES.ORDER_CREATED,
      );
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw err;
    }
  },

  async findMyOrders(
    userId: string,
    raw: {
      page: number;
      limit: number;
      sort: Record<string, 1 | -1>;
      status?: string;
    },
  ): Promise<ApiResponse<PaginatedOrders>> {
    await connectDB();

    const skip = calculateSkip(raw.page, raw.limit);

    const { orders, total } = await orderRepository.findByUser({
      userId,
      page: raw.page,
      limit: raw.limit,
      skip,
      sort: raw.sort,
      status: raw.status,
    });

    const pagination = calculatePagination({
      page: raw.page,
      limit: raw.limit,
      total,
    });

    return success({ orders, pagination }, MESSAGES.ORDERS_FETCHED);
  },

  async findMyOrderById(
    userId: string,
    orderId: string,
  ): Promise<ApiResponse<IOrder>> {
    await connectDB();

    const order = await orderRepository.findById(orderId);
    if (!order) {
      return error(MESSAGES.ORDER_NOT_FOUND);
    }

    if (order.user.toString() !== userId) {
      return error(MESSAGES.NOT_AUTHENTICATED);
    }

    return success(order, MESSAGES.ORDER_FETCHED);
  },

  async findAll(
    raw: {
      page: number;
      limit: number;
      sort: Record<string, 1 | -1>;
      search?: string;
      status?: string;
      paymentStatus?: string;
    },
  ): Promise<ApiResponse<PaginatedOrders>> {
    await connectDB();

    const skip = calculateSkip(raw.page, raw.limit);

    const filter: AdminOrderFilter = {
      page: raw.page,
      limit: raw.limit,
      skip,
      sort: raw.sort,
    };
    if (raw.search) filter.search = raw.search;
    if (raw.status) filter.status = raw.status;
    if (raw.paymentStatus) filter.paymentStatus = raw.paymentStatus;

    const { orders, total } = await orderRepository.findAll(filter);

    const pagination = calculatePagination({
      page: raw.page,
      limit: raw.limit,
      total,
    });

    return success({ orders, pagination }, MESSAGES.ORDERS_FETCHED);
  },

  async findById(id: string): Promise<ApiResponse<IOrder>> {
    await connectDB();

    const order = await orderRepository.findById(id);
    if (!order) {
      return error(MESSAGES.ORDER_NOT_FOUND);
    }

    return success(order, MESSAGES.ORDER_FETCHED);
  },

  async updateStatus(
    id: string,
    orderStatus: string,
  ): Promise<ApiResponse<IOrder>> {
    await connectDB();

    const order = await orderRepository.findById(id);
    if (!order) {
      return error(MESSAGES.ORDER_NOT_FOUND);
    }

    const updated = await orderRepository.updateStatus(id, orderStatus);
    if (!updated) {
      return error(MESSAGES.ORDER_NOT_FOUND);
    }

    return success(updated, MESSAGES.ORDER_UPDATED);
  },
};
