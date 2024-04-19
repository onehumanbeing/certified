"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Hero() {
    const router = useRouter()
    return (
        <div className="hero-content text-center flex w-full justify-between">
            <div className="w-1/2">
                <Image src="/assets/certified_logo.png" width={130} height={39} alt="Logo" />
            </div>
            <div className="w-1/2">
                <h1 className="text-5xl font-bold "></h1>
                <p className="py-6">Making Certification Simple</p>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        router.push("/certification")
                    }}
                >
                    Issue a certificate
                </button>
            </div>
        </div>
    )
}
