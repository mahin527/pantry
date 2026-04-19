import { Button } from '@mui/material'
import Link from 'next/link'
import { FaAngleDown } from "react-icons/fa6";

function NavLinks() {
    const navLinks = [
        { id: 1, title: "Home", link: "/" },
        { id: 2, title: "Fruits & Vegetables", link: "/" },
        { id: 3, title: "Meats & Seafood", link: "/" },
        { id: 4, title: "Breaksfast & Dairy", link: "/" },
        { id: 5, title: "Breads & Bakery", link: "/" },
        { id: 6, title: "Beverages", link: "/" },
        { id: 7, title: "Frozen Foods", link: "/" },
        { id: 8, title: "Biscuits & Snacks", link: "/" },
        { id: 9, title: "Grocery & Staples", link: "/" },

    ]
    return (
        <nav className="container py-4">
            <ul className='flex flex-wrap items-center justify-between gap-2'>
                {
                    navLinks.map((link) => (
                        <li key={link.id} className='text-sm md:text-base tracking-wide font-bold'>
                            <Link href={link.link} className='hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200'>{link.title}</Link>
                        </li>
                    ))
                }
                <li className='group relative text-sm md:text-base tracking-wider font-semibold'>
                    <span className='flex items-center justify-center cursor-pointer hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200'>
                        More
                        <FaAngleDown size={20} />
                    </span>
                    <div className='min-w-32 absolute top-full right-0 z-50 flex flex-col items-start bg-white dark:bg-gray-900 shadow-md rounded-md overflow-hidden opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible'>
                        <Link href={"/"} className='px-4 py-2 hover:bg-gray-200 dark:hover:bg-white/5 transition-colors'>Beverages</Link>
                        <Link href={"/"} className='px-4 py-2 hover:bg-gray-200 dark:hover:bg-white/5 transition-colors'>Breaksfast</Link>
                        <Link href={"/"} className='px-4 py-2 hover:bg-gray-200 dark:hover:bg-white/5 transition-colors'>Vegetables</Link>
                    </div>
                </li>

            </ul>
        </nav>
    )
}

export default NavLinks