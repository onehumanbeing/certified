"use client"

import { useUser } from "@/context/userContext"
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { useRouter } from "next/navigation"

export default function DynamicConnectButton() {
    const { user, authorized, userLogging, setUserLogging } = useUser()
    const { setShowAuthFlow } = useDynamicContext()
    const { primaryWallet } = useDynamicContext()

    const router = useRouter()

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
            {authorized && (
                <>
                    <button
                        className="btn btn-active h-3 mr-4 text-sm hidden lg:block btn-sm"
                        onClick={() => {
                            router.push(`/user/${primaryWallet?.address}`)
                        }}
                    >
                        view my certificate
                    </button>
                    <DynamicWidget />
                </>
            )}
        </>
    )
}
