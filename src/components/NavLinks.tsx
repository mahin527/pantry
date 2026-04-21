import Link from 'next/link'
import { FaAngleDown } from "react-icons/fa6";

function NavLinks() {
    const navLinks = [
        { id: 1, title: "Home", link: "/" },
        { id: 2, title: "Fruits & Vegetables", link: "/products" },
        { id: 3, title: "Meats & Seafood", link: "/products" },
        { id: 4, title: "Breaksfast & Dairy", link: "/products" },
        { id: 5, title: "Breads & Bakery", link: "/products" },
        { id: 6, title: "Beverages", link: "/products" },
        { id: 7, title: "Frozen Foods", link: "/products" },
        { id: 8, title: "Biscuits & Snacks", link: "/products" },
        { id: 9, title: "Grocery & Staples", link: "/products" },

    ]
    return (
        <nav className="container py-6  text-gray-700">
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
                    <div className='w-50 absolute top-full right-0 z-50 flex flex-col items-start bg-white shadow-md rounded-md overflow-hidden opacity-0 invisible transition-all duration-200 group-hover:opacity-100 group-hover:visible'> {/* dark:bg-gray-900 */}
                        {
                            navLinks.map((link) => (
                                <Link key={link.id} href={link.link} className='px-4 py-2 w-full hover:bg-gray-200 transition-colors'>{link.title}</Link>
                            ))
                        }
                    </div>
                </li>

            </ul>
        </nav>
    )
}

export default NavLinks