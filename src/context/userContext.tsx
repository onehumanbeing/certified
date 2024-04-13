"use client"

import { authUser } from "@/lib/request"
import React, { createContext, useContext, useEffect, useState } from "react"

export type UserType = {
    id: string
    name: string
    email: string
}

const UserContext = createContext<{
    user: UserType | null | undefined
    setUser: React.Dispatch<React.SetStateAction<UserType | null | undefined>>
    authorized: boolean
    logOut: () => void
    fetchUser: () => Promise<boolean>
    userLogging: boolean
    setUserLogging: React.Dispatch<React.SetStateAction<boolean>>
}>({
    user: undefined,
    setUser: () => {},
    authorized: false,
    logOut: () => {},
    fetchUser: async () => false,
    userLogging: false,
    setUserLogging: () => {},
})

interface UserProviderProps {
    children: React.ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    // undefined is used to indicate that the user is still being fetched
    // null is used to indicate that the user is not logged in
    const [user, setUser] = useState<UserType | null | undefined>(undefined)
    const [authorized, setAuthorized] = useState<boolean>(false)
    const [userLogging, setUserLogging] = useState<boolean>(false)
    const fetchUser = async () => {
        try {
            const data = await authUser()
            if (data) {
                setUser(data.user)
                if (data.user.id) {
                    setAuthorized(true)
                    return true
                } else {
                    setUser(null)
                    setAuthorized(false)
                    return false
                }
            } else {
                setUser(null)
                setAuthorized(false)
                return false
            }
        } catch (error) {
            console.error("Authentication failed:", error)
            setUser(null)
            setAuthorized(false)
            return false
        }
    }

    const logOut = () => {
        setUser(null)
        setAuthorized(false)
    }

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <UserContext.Provider
            value={{ user, setUser, authorized, logOut, fetchUser, userLogging, setUserLogging }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
