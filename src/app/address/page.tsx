"use client"

import AccountSidebar from '@/components/AccountSidebar'
import AddressList from '@/components/AddressList';
import { useAppContext } from "@/context/AppContext"
import { Button } from '@mui/material';
import { FaPlus } from "react-icons/fa";

function Address() {
    const { openAddAddress } = useAppContext()

    return (
        <section className='bg-gray-100 py-8'>
            <div className="container flex gap-5">
                <div className="w-[25%]">
                    <AccountSidebar />
                </div>

                <div className="wrapper w-[75%] space-y-8">
                    <div className="bg-white shadow-md rounded-md">
                        <div className="py-4 px-6 border-b border-gray-200 flex items-center justify-between">
                            <div className='space-y-2'>
                                <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                                    Address
                                </h3>
                                <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                                    Manage Your Addresses
                                </p>
                            </div>
                            <div>
                                <Button
                                    onClick={openAddAddress}
                                    variant='outlined' className='font-bold! flex! items-center! gap-2!'>
                                    <FaPlus size={16} /> Add new address
                                </Button>
                            </div>
                        </div>
                        <div>
                            <AddressList />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Address