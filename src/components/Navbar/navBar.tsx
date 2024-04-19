"use client"
import DynamicConnectButton from "@/components/DynamicModal/walletWidget"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function NavBar() {
    const router = useRouter()
    return (
        <div className="navbar bg-base-100 h-auto fixed z-50">
            <div className="navbar-start flex items-center">
                <div
                    className="cursor-pointer"
                    onClick={() => {
                        router.push("/")
                    }}
                >
                    <Image src="/assets/certified_logo.png" width={130} height={39} alt="Logo" />
                </div>
            </div>
            {/* <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <a>Item 1</a>
                    </li>
                    <li>
                        <details>
                            <summary>Parent</summary>
                            <ul className="p-2">
                                <li>
                                    <a>Submenu 1</a>
                                </li>
                                <li>
                                    <a>Submenu 2</a>
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <a>Item 3</a>
                    </li>
                </ul>
            </div> */}
            <div className="navbar-end">
                
                <DynamicConnectButton />
            </div>
        </div>
    )
}
