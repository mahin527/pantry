"use client"

import { useState, useEffect, useTransition } from "react"
import AccountSidebar from "@/components/AccountSidebar"
import { Button } from "@mui/material"
import TextField from "@mui/material/TextField"
import { useAuth } from "@/hooks/useAuth"

function MyAccount() {
  const { user } = useAuth()
  const [, startTransition] = useTransition()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    startTransition(() => {
      if (user) {
        setName(user.name)
        setEmail(user.email)
      }
    })
  }, [user])

  return (
    <section className="bg-gray-100 py-8">
      <div className="container flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-[25%]">
          <AccountSidebar />
        </div>

        <div className="wrapper w-full md:w-[75%] space-y-8">
          <div className="bg-white shadow-md rounded-md">
            <div className="py-4 space-y-2 px-6 border-b border-gray-200">
              <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                My Profile
              </h3>
              <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                All your account information in one place
              </p>
            </div>

            <form className="py-6 px-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 text-gray-600!">
                <div className="w-full">
                  <TextField
                    id="fullname"
                    name="fullname"
                    label="Fullname"
                    variant="outlined"
                    type="text"
                    className="w-full"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-full">
                  <TextField
                    id="email"
                    name="email"
                    label="Email"
                    variant="outlined"
                    type="text"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="py-3">
                <Button variant="contained" className="py-2.5! font-bold!">
                  Update Profile
                </Button>
              </div>
            </form>
          </div>

          <div className="bg-white shadow-md rounded-md">
            <div className="py-4 space-y-2 px-6 border-b border-gray-200">
              <h3 className="text-xl lg:text-2xl text-gray-700 tracking-wider font-bold">
                Change Password
              </h3>
              <p className="text-base lg:text-lg text-gray-600 tracking-wider font-bold">
                Update Your Password
              </p>
            </div>

            <form className="py-6 px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-6 text-gray-600!">
                <div className="w-full">
                  <TextField
                    id="old-password"
                    name="oldPassword"
                    label="Old Password"
                    variant="outlined"
                    type="text"
                    className="w-full"
                  />
                </div>
                <div className="w-full">
                  <TextField
                    id="new-password"
                    name="newPassword"
                    label="New Password"
                    variant="outlined"
                    type="text"
                    className="w-full"
                  />
                </div>
                <div className="w-full">
                  <TextField
                    id="confirm-password"
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="outlined"
                    type="text"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="py-3">
                <Button variant="contained" className="py-2.5! font-bold!">
                  Change Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MyAccount
