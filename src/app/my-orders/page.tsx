import AccountSidebar from "@/components/AccountSidebar"

function OrdersPage() {
  return (
    <section className='bg-gray-100 py-8'>
      <div className="container flex gap-5">
        <div className="w-[25%]">
          <AccountSidebar />
        </div>

        <div className="wrapper w-[75%] space-y-8">
          <div className="bg-white shadow-md rounded-md">
            <div className="py-4 space-y-2 px-6 border-b border-gray-200">
              <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                My Orders
              </h3>
              <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                There are <span className="text-blue-500 font-semibold">4</span> products in your Wishlist
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default OrdersPage