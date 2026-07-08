"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { CartProvider } from "./CartProvider"
import { WishlistProvider } from "./WishlistProvider"

type AppContextType = {
    isOpenAddAddressPanel: boolean
    openAddAddress: () => void
    closeAddAddress: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [isOpenAddAddressPanel, setIsOpenAddAddressPanel] = useState(false)

    const openAddAddress = () => setIsOpenAddAddressPanel(true)
    const closeAddAddress = () => setIsOpenAddAddressPanel(false)

    return (
        <AppContext.Provider value={{ isOpenAddAddressPanel, openAddAddress, closeAddAddress }}>
            <CartProvider>
                <WishlistProvider>
                    {children}
                </WishlistProvider>
            </CartProvider>
        </AppContext.Provider>
    )
}

// custom hook (clean usage)
export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context) throw new Error("useAppContext must be used inside AppProvider")
    return context
}