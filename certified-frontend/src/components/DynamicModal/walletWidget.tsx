"use client"

import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core"

export default function DynamicConnectButton() {
    const { setShowAuthFlow } = useDynamicContext()
    return (
        // <button className="btn" onClick={() => setShowAuthFlow(true)}>
        //     sign in or sign up
        // </button>
        <DynamicWidget />
    )
}
