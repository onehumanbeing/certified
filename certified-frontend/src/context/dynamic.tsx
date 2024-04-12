"use client"

import React from "react"
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core"
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum"
import { getCsrfToken } from "next-auth/react"

interface AppProps {
    children: React.ReactNode
}

const DynamicProvider: React.FC<AppProps> = ({ children }) => {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
                walletConnectors: [EthereumWalletConnectors],
                eventsCallbacks: {
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
                                    console.log("LOGGED IN", res)
                                } else {
                                    console.error("Failed to log in")
                                }
                            })
                            .catch((error) => {
                                console.error("Error logging in", error)
                            })
                    },
                },
            }}
        >
            {children}
        </DynamicContextProvider>
    )
}

export default DynamicProvider
