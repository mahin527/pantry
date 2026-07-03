"use client"

import AccountSidebar from "@/components/AccountSidebar"
import Pagination from '@mui/material/Pagination';
import Searchbar from "@/components/Searchbar"
import OrderTableRow from "@/components/OrderTableRow";

function OrdersPage() {
  return (
    <section className='bg-gray-100 py-8'>
      <div className="container flex gap-5">
        <div className="w-[25%]">
          <AccountSidebar />
        </div>

        <div className="wrapper w-[75%] space-y-8">
          <div className="bg-white shadow-md rounded-md">
            <div className="py-4 space-y-2 px-6 border-b border-gray-200 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                  My Orders
                </h3>
                <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                  There are <span className="text-blue-500 font-semibold">4</span> orders
                </p>
              </div>
              <div>
                <Searchbar placeholder="Search for orders..." />
              </div>
            </div>


            {/* Table */}
            <div className="w-full overflow-x-auto p-3 bg-white">
              <div className="inline-block min-w-full">
                <div className="overflow-x-auto bg-white text-gray-900 border-gray-200">
                  <table className="w-full min-w-max border-collapse text-xs lg:text-base">
                    <thead className="bg-gray-100 border-b border-gray-200">
                      <tr>
                        <th>
                          {""}
                        </th>
                        <th
                          className="px-3 py-2 h-8 text-left font-semibold whitespace-nowrap border-x border-gray-200">
                          Order Id
                        </th>
                        <th
                          className="px-3 py-2  h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                          Customer
                        </th>
                        <th
                          className="h-8 py-2  text-center font-semibold whitespace-nowrap border-r border-gray-200">
                          User Id
                        </th>
                        <th
                          className="h-8 py-2  text-center font-semibold whitespace-nowrap border-r border-gray-200">
                          Email
                        </th>
                        <th
                          className="px-3 py-2  h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                          Phone Number
                        </th>
                        <th
                          className="px-3 py-2  h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                          Address
                        </th>
                        <th
                          className="px-3 py-2  h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                          Pin Code
                        </th>
                        <th
                          className="px-3 py-2  h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                          Total
                        </th>
                        <th
                          className="px-3 py-2  h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                          Payment Id
                        </th>
                        <th
                          className="px-3 py-2  h-8 text-left font-semibold whitespace-nowrap border-r border-gray-200">
                          Order status
                        </th>
                        <th
                          className="h-8 py-2  text-center font-semibold whitespace-nowrap border-r border-gray-200">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <OrderTableRow />
                      <OrderTableRow />
                      <OrderTableRow />

                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <Pagination count={10} color="primary" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrdersPage