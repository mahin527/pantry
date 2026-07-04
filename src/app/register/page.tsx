"use client"

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useState } from 'react';
import { Button } from '@mui/material';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/validations';
import { useRouter } from 'next/navigation';

function Register() {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const router = useRouter()

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterInput) => {
        setServerError(null)
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            })
            const json = await res.json()
            if (!json.success) {
                setServerError(json.message || "Registration failed")
                return
            }
            router.push("/")
        } catch {
            setServerError("Something went wrong. Please try again.")
        }
    }

    return (
        <section className="relative overflow-hidden py-8 bg-gray-100 w-full h-screen flex items-center justify-center">
            <div className="container">
                    <div className='bg-white border border-gray-200 py-5 px-4 sm:px-8 rounded-md shadow-md w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl m-auto'>
                    <div className='text-center py-2'>
                        <h2 className='py-2 text-gray-700 text-xl lg:text-2xl font-semibold'>
                            Register with a new account
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-3 md:space-y-5 py-4'>
                        {serverError && (
                            <p className="text-red-500 text-sm font-medium text-center">{serverError}</p>
                        )}
                        <div className='w-full'>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="fullname"
                                        label="Fullname"
                                        variant="outlined"
                                        className='w-full!'
                                        type='text'
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                        </div>
                        <div className='w-full'>
                            <Controller
                                name="email"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="email"
                                        label="Email"
                                        variant="outlined"
                                        className='w-full!'
                                        type='email'
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </div>
                        <div className='w-full relative'>
                            <Controller
                                name="password"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        id="password"
                                        label="Password"
                                        variant="outlined"
                                        className='w-full!'
                                        type={`${isShowPassword ? 'text' : 'password'}`}
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                    />
                                )}
                            />
                            <IconButton onClick={() => setIsShowPassword(!isShowPassword)} size='large' aria-label="password-show-hide" className='absolute! right-2 top-1/2 -translate-y-1/2 z-10'>
                                {
                                    isShowPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />
                                }

                            </IconButton>
                        </div>
                        <div className='w-full'>
                            <Button type="submit" variant="contained" className='w-full! py-3! font-bold!' disabled={isSubmitting}>
                                {isSubmitting ? "Registering..." : "Register"}
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

            <div className="circle-1 bg-blue-500 opacity-20 size-70 rounded-full absolute bottom-0 left-[-16%]">
            </div>
            <div className="circle-2 bg-blue-500 opacity-20 size-70 rounded-full absolute top-0 right-[-16%]">
            </div>
        </section>
    )
}

export default Register
