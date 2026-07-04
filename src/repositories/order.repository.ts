import mongoose from "mongoose";
import { Order, IOrder } from "@/models";

export type OrderFilter = {
  userId: string;
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
  status?: string;
};

export const orderRepository = {
  async create(
    data: Partial<IOrder>,
    session?: mongoose.ClientSession,
  ): Promise<IOrder> {
    const [order] = await Order.create([data], { session });
    return order;
  },

  async findById(id: string): Promise<IOrder | null> {
    return Order.findById(id)
      .populate("items.product", "title slug price images brand");
  },

  async findByUser(filter: OrderFilter): Promise<{
    orders: IOrder[];
    total: number;
  }> {
    const query: Record<string, unknown> = { user: filter.userId };
    if (filter.status) {
      query.orderStatus = filter.status;
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("items.product", "title slug price images brand")
        .sort(filter.sort)
        .skip(filter.skip)
        .limit(filter.limit),
      Order.countDocuments(query),
    ]);

    return { orders, total };
  },

  async updateStatus(
    id: string,
    orderStatus: string,
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true },
    );
  },

  async count(userId: string): Promise<number> {
    return Order.countDocuments({ user: userId });
  },

  async delete(id: string): Promise<IOrder | null> {
    return Order.findByIdAndDelete(id);
  },
};
