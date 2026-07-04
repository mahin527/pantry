import { connectDB } from "@/lib/db";
import { userRepository } from "@/repositories/user.repository";
import { productRepository } from "@/repositories/product.repository";
import { categoryRepository } from "@/repositories/category.repository";
import { orderRepository } from "@/repositories/order.repository";
import { success } from "@/lib/api-response";
import { MESSAGES } from "@/lib/messages";
import type { ApiResponse } from "@/types/common";
import type { IUser, IProduct } from "@/models";
import type { IOrder } from "@/models";

type DashboardStats = {
  users: number;
  products: number;
  categories: number;
  orders: number;
  revenue: number;
  pendingOrders: number;
  lowStockProducts: number;
};

type DashboardResponse = {
  stats: DashboardStats;
  recentOrders: IOrder[];
  lowStockProductsList: IProduct[];
  latestUsers: IUser[];
};

export const dashboardService = {
  async getDashboard(): Promise<ApiResponse<DashboardResponse>> {
    await connectDB();

    const [
      users,
      products,
      categories,
      orders,
      revenue,
      pendingOrders,
      lowStockProducts,
      recentOrders,
      lowStockProductsList,
      latestUsers,
    ] = await Promise.all([
      userRepository.count(),
      productRepository.count(),
      categoryRepository.count(),
      orderRepository.countAll(),
      orderRepository.calculateRevenue(),
      orderRepository.countPending(),
      productRepository.countLowStock(),
      orderRepository.findRecent(5),
      productRepository.findLowStock(5),
      userRepository.findLatest(5),
    ]);

    return success(
      {
        stats: {
          users,
          products,
          categories,
          orders,
          revenue,
          pendingOrders,
          lowStockProducts,
        },
        recentOrders,
        lowStockProductsList,
        latestUsers,
      },
      MESSAGES.SUCCESS,
    );
  },
};
