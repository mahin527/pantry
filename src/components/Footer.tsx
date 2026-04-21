import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturnLight } from "react-icons/pi";
import { MdPayment } from "react-icons/md";
import { LiaGiftsSolid } from "react-icons/lia";
import { LiaSmsSolid } from "react-icons/lia";
import Link from "next/link";
import { Button } from "@mui/material";
import { FaFacebook } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { IoLogoLinkedin } from "react-icons/io5";
import { FaPinterest } from "react-icons/fa6";
import { RiVisaFill } from "react-icons/ri";
import { FaCcPaypal } from "react-icons/fa6";
import { FaCcAmazonPay } from "react-icons/fa";
import { FaCcApplePay } from "react-icons/fa";

function Footer() {

    return (
        <footer className="mx-auto">
            <div className="bg-gray-100"> {/* dark:bg-neutral-900 */}
                <div className='container'>
                    {/* icons */}
                    <div className='text-gray-600 py-6 lg:py-8 border-b border-gray-300 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 items-center justify-center gap-5 md:gap-8 lg:gap-14'> {/* dark:border-gray-800 */}
                        <div className="flex flex-col items-center justify-center gap-2 ">
                            <LiaShippingFastSolid size={36} />
                            <p>
                                Free Shipping
                            </p>
                            <p>
                                For All Orders Over $100
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 ">
                            <PiKeyReturnLight size={36} />
                            <p>
                                30 Days Returns
                            </p>
                            <p>
                                For an Exchange Product
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 ">
                            <MdPayment size={36} />
                            <p>
                                Secured Payment
                            </p>
                            <p>
                                Payment Cards Accepted
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 ">
                            <LiaGiftsSolid size={36} />
                            <p>
                                Special Gifts
                            </p>
                            <p>
                                Our First Product Order
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-2 ">
                            <LiaGiftsSolid size={36} />
                            <p>
                                Support 24/7
                            </p>
                            <p>
                                Contact Us Anytime
                            </p>
                        </div>
                    </div>

                    <div className="text-gray-600 flex justify-between flex-wrap gap-5 py-8">
                        <div className="contact tracking-wider xl:tracking-widest space-y-3 lg:space-y-4">
                            <h3 className="text-xl lg:text-2xl font-semibold">
                                Contact us
                            </h3>
                            <div>
                                <p>
                                    Classyshop - Mega Super Town
                                </p>
                                <p>
                                    Jashore, Khulna, Bangladesh
                                </p>
                            </div>
                            <p>
                                hasan.mahin527@gmail.com
                            </p>
                            <p>
                                +880 12345 6789
                            </p>
                            <div className="flex items-center gap-3 lg:gap-5">
                                <LiaSmsSolid size={36} />
                                <div className="font-semibold">
                                    <h4>
                                        Online Chat
                                    </h4>
                                    <h4>
                                        Get Expert Help
                                    </h4>
                                </div>
                            </div>
                        </div>

                        <div className="products tracking-wider xl:tracking-widest">
                            <h3 className="text-xl lg:text-2xl font-semibold pb-2">
                                Products
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        Price drop
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        New products
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        Best sales
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        Contact us
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        Sitemap
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        Stores
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="our-company tracking-wider xl:tracking-widest">
                            <h3 className="text-xl lg:text-2xl font-semibold pb-2">
                                Our company
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        Delivery
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        Legal notice
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        Terms and conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        About us
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        Secure payment
                                    </Link>
                                </li>
                                <li>
                                    <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                        Login
                                    </Link>
                                </li>
                            </ul>
                        </div>


                        <div className="subscribe-newsletter tracking-wider xl:tracking-widest">
                            <h3 className="text-xl lg:text-2xl font-semibold pb-2">
                                Subscribe to our newsletter
                            </h3>

                            <p>
                                Subscribe to our latest newsletter to get news about special discounts.
                            </p>
                            <form className="w-full flex flex-col gap-4 py-4">
                                <div className="search-box bg-black/5 w-150 h-14 rounded-md flex items-center"> {/* dark:bg-white/15 */}
                                    <input type="text" placeholder="Enter your email" className="px-4 text-sm md:text-base lg:text-lg tracking-wider outline-none border-none w-full h-full" />
                                </div>
                                <Button variant="contained" className="max-w-fit">
                                    SUBSCRIBE
                                </Button>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" name="agreement" id="agreement" className="h-5 w-5 text-gray-600 rounded-full" />
                                    <label htmlFor="agreement">
                                        I agree to the terms and conditions and the privacy policy
                                    </label>
                                </div>
                                {/* <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="hidden peer"
                                />

                                <div className="w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center peer-checked:bg-blue-500 peer-checked:border-blue-500">
                                    <div className="w-2.5 h-2.5 bg-white rounded-full hidden peer-checked:block"></div>
                                </div>

                                <span>
                                    I agree to the terms and conditions and the privacy policy
                                </span>
                            </label> */}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container py-4 text-gray-600 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-0">
                <div>
                    <ul className="flex flex-wrap items-center gap-4">
                        <li>
                            <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                <IoLogoLinkedin size={32} />
                            </Link>
                        </li>
                        <li>
                            <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                <FaGithub size={32} />
                            </Link>
                        </li>
                        <li>
                            <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                <FaFacebook size={32} />
                            </Link>
                        </li>
                        <li>
                            <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                <FaPinterest size={32} />
                            </Link>
                        </li>
                    </ul>
                </div>
                <div>
                    &copy; Pantry 2026 | All Rights Reserved by Mahin Hasan
                </div>
                <div>
                    <ul className="flex flex-wrap items-center gap-4">
                        <li>
                            <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                <RiVisaFill size={32} />
                            </Link>
                        </li>
                        <li>
                            <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                <FaCcPaypal size={32} />
                            </Link>
                        </li>
                        <li>
                            <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                <FaCcAmazonPay size={32} />
                            </Link>
                        </li>
                        <li>
                            <Link href={"/"} className="font-medium hover:text-blue-500 transition-colors duration-150">
                                <FaCcApplePay size={32} />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer