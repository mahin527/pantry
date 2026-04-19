import Image from "next/image"
import logoImg from "../../public/logo-img.png"
import Link from "next/link"
import Searchbar from "./Searchbar"
import NavMenus from "./NavIcons"
import NavLinks from "./NavLinks"

const Header = () => {
    return (
        <header>
            <div className="border-b border-gray-300 dark:border-gray-800">
                <div className="container py-4">
                    <div className="flex items-center justify-between">
                        <div className="logo">
                            <Link href={"/"} className="flex items-center justify-center gap-2 bg-black/10 dark:bg-white/15 py-2 px-5 rounded-full">
                                <Image src={logoImg} alt="Pantry logo" width={120} height={120} className="size-12 md:size-14 lg:size-16 2xl:size-18" />
                                <h3 className="text-2xl lg:text-3xl font-black font-sans text-blue-500 dark:text-blue-400">Pantry</h3>
                            </Link>
                        </div>
                        <Searchbar />
                        <NavMenus />
                    </div>
                </div>
            </div>
                <NavLinks />
        </header>
    )
}

export default Header