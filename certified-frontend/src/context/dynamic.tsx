"use client"

import React from "react"
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core"
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum"

interface AppProps {
    children: React.ReactNode
}

const DynamicProvider: React.FC<AppProps> = ({ children }) => {
    return (
        <DynamicContextProvider
            settings={{
                environmentId: process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID!,
                walletConnectors: [EthereumWalletConnectors],
            }}
        >
            {children}
        </DynamicContextProvider>
    )
}

export default DynamicProvider
