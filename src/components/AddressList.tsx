"use client"

import { FaRegEdit } from "react-icons/fa";
import { Button } from '@mui/material';
import Radio from '@mui/material/Radio';
import { RiDeleteBin6Line } from "react-icons/ri";

function AddressList() {
    return (
        <div className='py-6 px-6 space-y-5'>
            {
                [1, 2, 3].map((address, index) => (
                    <div key={index} className='flex justify-between py-4 border border-gray-200 w-full rounded-md shadow-md'>
                        <div className=''>
                            <label htmlFor="isHomeAddress" className='flex items-center gap-2 text-blue-500 cursor-pointer font-bold'>
                                <Radio
                                    value="a"
                                    name="isHomeAddress"
                                    id="isHomeAddress"
                                />

                                Home
                            </label>
                            <div className='info flex flex-col gap-2 pl-12 text-gray-600 font-medium'>
                                <span className='font-semibold'>
                                    Mahin Hasan
                                </span>
                                <span>
                                    Jashore, Khulna, Bangladesh
                                </span>
                                <span>
                                    +880 12346 7879
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <Button className='py-5! rounded-full! font-bold!'>
                                <FaRegEdit size={20} />
                            </Button>
                            <Button className='py-5! rounded-full! font-bold! text-red-600!'>
                                <RiDeleteBin6Line size={20} />
                            </Button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default AddressList