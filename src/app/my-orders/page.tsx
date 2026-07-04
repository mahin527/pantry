import { fetchApi } from "@/lib/fetch-api"
import AccountSidebar from "@/components/AccountSidebar"
import OrderTableRow from "@/components/OrderTableRow"
import { MyOrdersToolbar } from "./MyOrdersToolbar"
import { MyOrdersPagination } from "./MyOrdersPagination"

type OrderItem = {
  product: { _id: string; title: string; slug: string; price: number; images: string[]; brand?: string }
  title: string
  quantity: number
  price: number
  image: string
}

type Order = {
  _id: string
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  total: number
  paymentStatus: string
  orderStatus: string
  createdAt: string
}

type OrdersData = {
  orders: Order[]
  pagination: { total: number; page: number; limit: number; totalPages: number }
}

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function MyOrdersPage({ searchParams }: Props) {
  const sp = await searchParams
  const page = typeof sp.page === "string" ? sp.page : "1"
  const status = typeof sp.status === "string" ? sp.status : ""

  const params = new URLSearchParams()
  params.set("page", page)
  params.set("limit", "10")
  if (status) params.set("status", status)

  const data = await fetchApi<OrdersData>(`/api/orders?${params.toString()}`)
  const orders = data?.orders ?? []
  const pagination = data?.pagination

  return (
    <section className="bg-gray-100 py-8">
      <div className="container flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-[25%]">
          <AccountSidebar />
        </div>
        <div className="wrapper w-full md:w-[75%] space-y-8">
          <div className="bg-white shadow-md rounded-md">
            <div className="py-4 space-y-2 px-6 border-b border-gray-200 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                  My Orders
                </h3>
                <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                  There are{" "}
                  <span className="text-blue-500 font-semibold">
                    {pagination?.total ?? 0}
                  </span>{" "}
                  orders
                </p>
              </div>
              <MyOrdersToolbar currentStatus={status} />
            </div>

            {orders.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <p className="text-gray-500 font-medium">No orders yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  <a href="/products" className="text-blue-500 hover:underline font-bold">
                    Start Shopping
                  </a>
                </p>
              </div>
            ) : (
              <>
                <div className="w-full overflow-x-auto p-3 bg-white">
                  <div className="min-w-[650px] md:min-w-full">
                      <table className="w-full min-w-[650px] md:min-w-full border-collapse text-xs lg:text-base">
                        <thead className="bg-gray-100 border-b border-gray-200">
                          <tr>
                            <th></th>
                            <th className="px-3 py-2 h-8 text-left font-semibold whitespace-nowrap border-x border-gray-200">
                              Order Id
                            </th>
                            <th className="px-3 py-2 h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                              Items
                            </th>
                            <th className="px-3 py-2 h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                              Total
                            </th>
                            <th className="px-3 py-2 h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                              Payment
                            </th>
                            <th className="px-3 py-2 h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                              Status
                            </th>
                            <th className="px-3 py-2 h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                              Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <OrderTableRow key={order._id} order={order} />
                          ))}
                        </tbody>
                      </table>
                  </div>
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center py-6">
                    <MyOrdersPagination
                      currentPage={pagination.page}
                      totalPages={pagination.totalPages}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
