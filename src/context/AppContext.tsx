"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type AppContextType = {
    isOpenAddAddressPannel: boolean
    openAddAddress: () => void
    closeAddAddress: () => void
}

const AppContext = createContext<AppContextType | null>(null)

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [isOpenAddAddressPannel, setIsOpenAddAddressPannel] = useState(false)

    const openAddAddress = () => setIsOpenAddAddressPannel(true)
    const closeAddAddress = () => setIsOpenAddAddressPannel(false)

    return (
        <AppContext.Provider value={{ isOpenAddAddressPannel, openAddAddress, closeAddAddress }}>
            {children}
        </AppContext.Provider>
    )
}

// custom hook (clean usage)
export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context) throw new Error("useAppContext must be used inside AppProvider")
    return context
}