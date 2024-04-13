"use client"

import { useUser } from "@/context/userContext"
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core"

export default function DynamicConnectButton() {
    const { user, authorized, userLogging, setUserLogging } = useUser()
    const { setShowAuthFlow } = useDynamicContext()
    return (
        <>
            {user === null && (
                <button
                    className="btn flex justify-center items-center min-w-[120px] "
                    onClick={() => {
                        setUserLogging(true)
                        setShowAuthFlow(true)
                    }}
                >
                    {userLogging ? (
                        <span className="loading loading-dots loading-lg"></span>
                    ) : (
                        "sign in or sign up"
                    )}
                </button>
            )}
            {authorized && <DynamicWidget />}
        </>
    )
}
