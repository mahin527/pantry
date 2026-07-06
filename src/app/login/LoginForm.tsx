"use client"

import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/validations';
import { useRouter, useSearchParams } from 'next/navigation';
import { setCachedUser } from '@/hooks/useAuth';

function LoginForm() {
    const [isShowPassword, setIsShowPassword] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [successOpen, setSuccessOpen] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginInput) => {
        setServerError(null)
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            })
            const json = await res.json()
            if (!json.success) {
                setServerError(json.message || "Login failed")
                return
            }
            try {
                const userRes = await fetch("/api/users/me", { credentials: "include" })
                const userJson = await userRes.json()
                if (userJson.success && userJson.data) {
                    setCachedUser(userJson.data)
                }
            } catch {}
            setSuccessOpen(true)
            setTimeout(() => router.push(callbackUrl), 1200)
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
                            Login to your account
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className='space-y-3 md:space-y-5 py-4'>
                        {serverError && (
                            <p className="text-red-500 text-sm font-medium text-center">{serverError}</p>
                        )}
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
                                {isShowPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
                            </IconButton>
                        </div>
                        <div>
                            <Link href={"/forgot-password"} className='text-gray-600 font-bold hover:text-blue-500'>Forgot Password?</Link>
                        </div>
                        <div className='w-full'>
                            <Button type="submit" variant="contained" className='w-full! py-3! font-bold!' disabled={isSubmitting}>
                                {isSubmitting ? "Logging in..." : "Login"}
                            </Button>
                        </div>
                        <div className='text-center text-gray-600 font-medium flex flex-col gap-y-4'>
                            <span>
                                Not Registered? <Link href={"/register"} className='text-blue-500 font-bold'>Signup</Link>
                            </span>
                            <span>Or continue with social account</span>
                            <Button className='w-full! py-2.5! font-bold! bg-gray-100!'
                                loading={false}
                                loadingPosition='end'
                                startIcon={<FcGoogle />}
                                variant='outlined'
                            >
                                Login with Google
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <Snackbar
                open={successOpen}
                autoHideDuration={2000}
                onClose={() => setSuccessOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert severity="success" variant="filled" onClose={() => setSuccessOpen(false)}>
                    Welcome back!
                </Alert>
            </Snackbar>

            <div className="circle-1 bg-blue-500 opacity-20 size-70 rounded-full absolute bottom-0 -left-[16%]"></div>
            <div className="circle-2 bg-blue-500 opacity-20 size-70 rounded-full absolute top-0 -right-[16%]"></div>
        </section>
    )
}

export default LoginForm
