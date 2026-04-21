"use client"

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useState } from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';

function Register() {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    return (
        <section className="relative py-8 bg-gray-100 w-full h-screen flex items-center justify-center">
            <div className="container">
                <div className='bg-white py-5 px-8 rounded-md shadow-md w-86 md:w-90 lg:w-100 xl:w-106 m-auto'>
                    <div className='text-center py-2'>
                        <h2 className='py-2 text-gray-700 text-xl lg:text-2xl font-semibold'>
                            Register with a new account
                        </h2>
                    </div>
                    <form className='space-y-3 md:space-y-5 py-4'>
                        <div className='w-full'>
                            <TextField id="fullname" label="Fullname" variant="outlined" className='w-full!' type='text' />
                        </div>
                        <div className='w-full'>
                            <TextField id="email" label="Email" variant="outlined" className='w-full!' type='email' />
                        </div>
                        <div className='w-full relative'>
                            <TextField id="password" label="Password" variant="outlined" className='w-full!' type={`${isShowPassword ? 'text' : 'password'}`} />
                            <IconButton onClick={() => setIsShowPassword(!isShowPassword)} size='large' aria-label="password-show-hide" className='absolute! right-2 top-1/2 -translate-y-1/2 z-10'>
                                {
                                    isShowPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />
                                }

                            </IconButton>
                        </div>
                        <div className='w-full'>
                            <Button variant="contained" className='w-full! py-3! font-bold!'>
                                Register
                            </Button>
                        </div>
                        <div className='text-center text-gray-600 font-medium flex flex-col gap-y-4'>
                            <span>
                                Already have an account? <Link href={"/login"} className='text-blue-500 font-bold'>Login</Link>
                            </span>
                            <span>
                                Or continue with social account
                            </span>

                            <Button className='w-full! py-2.5! font-bold! bg-gray-100!'
                                loading={false}
                                loadingPosition='end'
                                startIcon={<FcGoogle />}
                                variant='outlined'
                            >
                                Signup with Google
                            </Button>
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

export default Register