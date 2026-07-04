import mongoose from "mongoose"
import { Order, IOrder } from "@/models"

export type OrderFilter = {
  userId: string
  page: number
  limit: number
  skip: number
  sort: Record<string, 1 | -1>
  status?: string
}

export type AdminOrderFilter = {
  page: number
  limit: number
  skip: number
  sort: Record<string, 1 | -1>
  search?: string
  status?: string
  paymentStatus?: string
}

export const orderRepository = {
  async create(
    data: Partial<IOrder>,
    session?: mongoose.ClientSession,
  ): Promise<IOrder> {
    const [order] = await Order.create([data], { session })
    return order
  },

  async findById(id: string): Promise<IOrder | null> {
    return Order.findById(id)
      .populate("items.product", "title slug price images brand")
      .populate("user", "name email")
  },

  async findByUser(filter: OrderFilter): Promise<{
    orders: IOrder[]
    total: number
  }> {
    const query: Record<string, unknown> = { user: filter.userId }
    if (filter.status) {
      query.orderStatus = filter.status
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("items.product", "title slug price images brand")
        .sort(filter.sort)
        .skip(filter.skip)
        .limit(filter.limit),
      Order.countDocuments(query),
    ])

    return { orders, total }
  },

  async findAll(filter: AdminOrderFilter): Promise<{
    orders: IOrder[]
    total: number
  }> {
    const query: Record<string, unknown> = {}

    if (filter.search) {
      query._id = filter.search
    }
    if (filter.status) {
      query.orderStatus = filter.status
    }
    if (filter.paymentStatus) {
      query.paymentStatus = filter.paymentStatus
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate("items.product", "title slug price images brand")
        .populate("user", "name email")
        .sort(filter.sort)
        .skip(filter.skip)
        .limit(filter.limit),
      Order.countDocuments(query),
    ])

    return { orders, total }
  },

  async updateStatus(
    id: string,
    orderStatus: string,
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, { orderStatus }, { new: true })
  },

  async count(userId: string): Promise<number> {
    return Order.countDocuments({ user: userId })
  },

  async delete(id: string): Promise<IOrder | null> {
    return Order.findByIdAndDelete(id)
  },

  async countAll(): Promise<number> {
    return Order.countDocuments();
  },

  async countPending(): Promise<number> {
    return Order.countDocuments({ orderStatus: "pending" });
  },

  async calculateRevenue(): Promise<number> {
    const result = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    return result[0]?.total ?? 0;
  },

  async findRecent(limit: number): Promise<IOrder[]> {
    return Order.find()
      .populate("items.product", "title slug price images brand")
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(limit);
  },
}
