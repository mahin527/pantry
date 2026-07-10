"use client"

import { LiaShippingFastSolid, LiaSmsSolid, LiaGiftsSolid } from "react-icons/lia";
import { PiKeyReturnLight } from "react-icons/pi";
import { MdPayment } from "react-icons/md";
import Link from "next/link";
import { Button } from "@mui/material";
import { FaFacebookF, FaGithub, FaPinterestP, FaCcPaypal, FaCcAmazonPay, FaCcApplePay, FaArrowRight } from "react-icons/fa6";
import { IoLogoLinkedin } from "react-icons/io5";
import { RiVisaFill } from "react-icons/ri";
import Drawer from '@mui/material/Drawer';
import { useAppContext } from "@/providers/AppProvider"
import TextField from '@mui/material/TextField';
import { useState } from "react";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { IoIosSend } from "react-icons/io";
import { toast } from "sonner";
import { CircularProgress } from "@mui/material";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/constants/contact"

function Footer() {
    const { isOpenAddAddressPanel, closeAddAddress, onAddressAdded } = useAppContext()
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        country: "",
        city: "",
        area: "",
        street: "",
        postalCode: "",
        label: "Home" as "Home" | "Office" | "Other",
        isDefault: false,
    })
    const [saving, setSaving] = useState(false)

    const updateField = (field: string, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const validateForm = () => {
        if (!formData.fullName.trim()) return "Full name is required"
        if (!formData.phone.trim()) return "Phone is required"
        if (!formData.street.trim()) return "Street address is required"
        if (!formData.city.trim()) return "City is required"
        if (!formData.country.trim()) return "State is required"
        if (!formData.postalCode.trim()) return "Postal code is required"
        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationError = validateForm()
        if (validationError) {
            toast.error(validationError)
            return
        }

        setSaving(true)
        try {
            const res = await fetch("/api/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    fullName: formData.fullName.trim(),
                    phone: formData.phone.trim(),
                    country: formData.country.trim(),
                    city: formData.city.trim(),
                    area: formData.area.trim(),
                    street: formData.street.trim(),
                    postalCode: formData.postalCode.trim(),
                    label: formData.label,
                    isDefault: formData.isDefault,
                }),
            })

            const json = await res.json()
            if (json.success) {
                toast.success("Address added successfully!")
                closeAddAddress()
                if (onAddressAdded) onAddressAdded()
                setFormData({
                    fullName: "",
                    phone: "",
                    country: "",
                    city: "",
                    area: "",
                    street: "",
                    postalCode: "",
                    label: "Home",
                    isDefault: false,
                })
            } else {
                toast.error(json.message || "Failed to add address")
            }
        } catch {
            toast.error("Failed to add address")
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            <footer className="mx-auto bg-gray-900 text-gray-300">
                {/* Feature bar */}
                <div className="bg-gray-800 border-b border-gray-700">
                    <div className="container py-5 md:py-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                        {[
                            { icon: LiaShippingFastSolid, title: "Free Shipping", desc: "On orders over $100" },
                            { icon: PiKeyReturnLight, title: "30 Days Return", desc: "For exchange product" },
                            { icon: MdPayment, title: "Secure Payment", desc: "Payment cards accepted" },
                            { icon: LiaGiftsSolid, title: "Special Gifts", desc: "First product order" },
                            { icon: LiaSmsSolid, title: "Support 24/7", desc: "Contact us anytime" },
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center gap-1">
                                <item.icon size={28} className="text-blue-400" />
                                <p className="text-sm font-bold text-white">{item.title}</p>
                                <p className="text-xs text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main footer columns */}
                <div className="container py-8 md:py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                        {/* Brand column */}
                        <div className="space-y-4">
                            <h3 className="text-2xl font-black text-white tracking-tight">
                                <span className="text-blue-400">P</span>antry
                            </h3>
                            <p className="text-sm text-gray-400 leading-relaxed">
                                Your one-stop shop for fresh groceries, farm produce, and everyday essentials delivered to your doorstep.
                            </p>
                            <div className="pt-2">
                                <p className="text-sm font-semibold text-white">Contact Us</p>
                                <p className="text-sm text-gray-400 mt-1">{CONTACT_EMAIL}</p>
                                <p className="text-sm text-gray-400">{CONTACT_PHONE}</p>
                            </div>
                            <div className="flex items-center gap-3 pt-1">
                                <Link href="/" className="w-9 h-9 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-colors text-gray-300 hover:text-white">
                                    <FaFacebookF size={16} />
                                </Link>
                                <Link href="/" className="w-9 h-9 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-colors text-gray-300 hover:text-white">
                                    <FaGithub size={16} />
                                </Link>
                                <Link href="/" className="w-9 h-9 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-colors text-gray-300 hover:text-white">
                                    <IoLogoLinkedin size={16} />
                                </Link>
                                <Link href="/" className="w-9 h-9 rounded-full bg-gray-700 hover:bg-blue-600 flex items-center justify-center transition-colors text-gray-300 hover:text-white">
                                    <FaPinterestP size={16} />
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
                            <ul className="space-y-2.5">
                                {["Home", "About Us", "Products", "Stores", "Sitemap", "Contact"].map((item) => (
                                    <li key={item}>
                                        <Link href="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1.5">
                                            <FaArrowRight size={8} className="text-blue-400" />
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Categories */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Categories</h4>
                            <ul className="space-y-2.5">
                                {["Fruits & Vegetables", "Meats & Seafood", "Breakfast & Dairy", "Breads & Bakery", "Beverages", "Snacks & Biscuits"].map((item) => (
                                    <li key={item}>
                                        <Link href="/products" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div className="space-y-3 sm:col-span-2 md:col-span-1">
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Newsletter</h4>
                            <p className="text-sm text-gray-400">Subscribe for exclusive deals and fresh arrivals.</p>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center bg-gray-800 rounded-lg border border-gray-700 focus-within:border-blue-500 transition-colors relative">
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="relative flex-1 px-2 py-2.5 text-sm bg-transparent outline-none text-white placeholder-gray-500"
                                    />
                                    <button type="submit" aria-label="Subscribe to newsletter" className="absolute h-full right-0 px-2 rounded-sm bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer">
                                        <IoIosSend size={28} className="" />
                                    </button>
                                </div>
                                <label htmlFor="newsletter-consent" className="flex items-start gap-2 cursor-pointer">
                                    <input type="checkbox" id="newsletter-consent" aria-describedby="newsletter-description" className="mt-0.5 accent-blue-600" />
                                    <span id="newsletter-description" className="text-xs text-gray-400">I agree to the terms and privacy policy</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800">
                    <div className="container py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-xs md:text-sm text-gray-500 text-center md:text-left">
                            &copy; {new Date().getFullYear()} Pantry. All rights reserved.
                        </p>
                        <div className="flex items-center gap-3">
                            <RiVisaFill size={28} className="text-gray-500" />
                            <FaCcPaypal size={28} className="text-gray-500" />
                            <FaCcAmazonPay size={28} className="text-gray-500" />
                            <FaCcApplePay size={28} className="text-gray-500" />
                        </div>
                    </div>
                </div>
            </footer>

            {/* Address Drawer */}
            <div>
                <Drawer open={isOpenAddAddressPanel} onClose={closeAddAddress} anchor="right">
                    <form className="w-100 md:w-120 lg:w-140 p-4" onSubmit={handleSubmit}>
                        <div className="py-2">
                            <h3 className="text-gray-700 text-lg lg:text-xl font-bold mb-4 text-center">Add Delivery Address</h3>
                        </div>
                        <div className='w-full space-y-4 text-gray-600!'>
                            <div>
                                <TextField
                                    label="Full Name"
                                    variant="outlined"
                                    className='w-full!'
                                    value={formData.fullName}
                                    onChange={(e) => updateField("fullName", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Phone"
                                    variant="outlined"
                                    className='w-full!'
                                    value={formData.phone}
                                    onChange={(e) => updateField("phone", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Street Address"
                                    variant="outlined"
                                    className='w-full!'
                                    value={formData.street}
                                    onChange={(e) => updateField("street", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <TextField
                                    label="City"
                                    variant="outlined"
                                    className='w-full!'
                                    value={formData.city}
                                    onChange={(e) => updateField("city", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Country"
                                    variant="outlined"
                                    className='w-full!'
                                    value={formData.country}
                                    onChange={(e) => updateField("country", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <TextField
                                    label="Postal Code"
                                    variant="outlined"
                                    className='w-full!'
                                    value={formData.postalCode}
                                    onChange={(e) => updateField("postalCode", e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <FormControl>
                                    <FormLabel>Address Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={formData.label}
                                        onChange={(e) => updateField("label", e.target.value)}
                                    >
                                        <FormControlLabel value="Home" control={<Radio />} label="Home" />
                                        <FormControlLabel value="Office" control={<Radio />} label="Office" />
                                        <FormControlLabel value="Other" control={<Radio />} label="Other" />
                                    </RadioGroup>
                                </FormControl>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={formData.isDefault}
                                    onChange={(e) => updateField("isDefault", e.target.checked)}
                                    className="accent-blue-600"
                                />
                                <label htmlFor="isDefault" className="text-sm text-gray-600">Set as default address</label>
                            </div>
                            <div>
                                <Button
                                    variant="contained"
                                    className="w-full py-2!"
                                    type="submit"
                                    disabled={saving}
                                >
                                    {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Drawer>
            </div>
        </>
    )
}

export default Footer
