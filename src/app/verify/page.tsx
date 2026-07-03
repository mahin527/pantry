"use client"

import TextField from '@mui/material/TextField';
import { FaArrowRightLong } from "react-icons/fa6";
import { IoShieldHalfSharp } from "react-icons/io5";

import { Button } from '@mui/material';
import Link from 'next/link';
import { FormEventHandler, useState } from 'react';
import OtpBox from '@/components/OtpBox';

function VerifyOtp() {
    const [otp, setOtp] = useState<string>("")

    const handleChangeOtp = (value: string) => {
        setOtp(value)
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        console.log({ otp });

    }
    return (
        <section className="relative overflow-hidden py-8 bg-gray-100 w-full h-screen flex items-center justify-center">
            <div className="container">
                <div className='bg-white border border-gray-200 py-5 px-8 rounded-md shadow-md w-86 md:w-90 lg:w-100 xl:w-106 m-auto'>
                    <div className='flex items-center justify-center text-blue-800'>
                        <IoShieldHalfSharp size={70} />
                    </div>
                    <div className='text-center py-2'>
                        <h2 className='py-2 text-gray-700 text-xl lg:text-2xl font-semibold'>
                            Verify OTP
                        </h2>
                        <p className='text-gray-600 text-xs lg:text-sm font-medium tracking-wide leading-5'>
                            OTP send to <span className='font-bold text-blue-700'>
                                example@gmail.com
                            </span>
                        </p>
                    </div>
                    <form onSubmit={handleSubmit} className='space-y-3 md:space-y-5 py-4'>
                        <OtpBox length={6} onChange={handleChangeOtp} />

                        <div className='w-full'>
                            <Button type='submit' variant="contained" className='w-full! py-3! font-bold!'>
                                Verify OTP
                            </Button>
                        </div>
                        <div className='text-center text-gray-600 font-medium flex flex-col items-center justify-center gap-y-4'>
                            <Link href={"/login"} className='hover:text-blue-500 font-bold flex items-center gap-2'>Back to login <FaArrowRightLong /></Link>
                        </div>
                    </form>
                </div>
            </div>

            <div className="circle-1 bg-blue-500 opacity-20 size-70 rounded-full absolute bottom-0 -left-[16%]">
            </div>
            <div className="circle-2 bg-blue-500 opacity-20 size-70 rounded-full absolute top-0 -right-[16%]">
            </div>
        </section>
    )
}

export default VerifyOtp