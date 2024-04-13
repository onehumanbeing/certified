"use client"

import React from "react"
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core"
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum"
import { getCsrfToken } from "next-auth/react"
import { useUser } from "./userContext"

interface AppProps {
    children: React.ReactNode
}

const DynamicProvider: React.FC<AppProps> = ({ children }) => {
    const { logOut, fetchUser, setUserLogging } = useUser()

    const fetchUserWithRetry = async (maxAttempts = 5): Promise<void> => {
        let attempts = 0

        const executeFetch = async (): Promise<boolean> => {
            attempts++
            setUserLogging(true)

            try {
                const result = await fetchUser()
                if (result) {
                    return true
                } else {
                    throw new Error("Failed to authenticate user")
                }
            } catch (error) {
                console.error(`Attempt ${attempts}:`, error)
                if (attempts < maxAttempts) {
                    console.log(`Retrying... (${attempts}/${maxAttempts})`)
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                    return executeFetch()
                } else {
                    console.log("Max attempts reached, failed to authenticate user, please refresh page.")
                    return false
                }
            } finally {
                setUserLogging(false)
            }
        }

        await executeFetch()
    }

    return (
        <DynamicContextProvider
            settings={{
                environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
                walletConnectors: [EthereumWalletConnectors],
                eventsCallbacks: {
                    onAuthFlowCancel: async () => {
                        setUserLogging(false)
                    },
                    onAuthSuccess: async (event) => {
                        const { authToken } = event

                        const csrfToken = await getCsrfToken()
                        fetch("/api/auth/callback/credentials", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: `csrfToken=${encodeURIComponent(
                                csrfToken as "string" | number | boolean
                            )}&token=${encodeURIComponent(authToken)}`,
                        })
                            .then((res) => {
                                if (res.ok) {
                                    console.log("LOGGED IN")
                                } else {
                                    console.error("Failed to log in")
                                }
                            })
                            .catch((error) => {
                                console.error("Error logging in", error)
                            })
                            .finally(() => {
                                fetchUserWithRetry()
                            })
                    },
                    onLogout: async () => {
                        logOut()
                    },
                },
            }}
        >
            {children}
        </DynamicContextProvider>
    )
}

export default DynamicProvider
