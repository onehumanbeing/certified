"use client"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Hero() {
    const router = useRouter()
    return (
        <div className="hero-content text-center flex w-full justify-between">
            <div className="w-1/2">
                <Image src="/assets/landing.png" width={800} height={800} alt="Logo" />
            </div>
            <div className="w-1/2">
                <h1 className="text-5xl font-bold "></h1>
                <p className="py-6">Simplifying Certification on Blockchain</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <div className="text-center">
                        <p className="text-4xl font-bold">1000</p>
                        <p>License Issued</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold">100</p>
                        <p>Users</p>
                    </div>
                    <div className="text-center">
                        <p className="text-4xl font-bold">123</p>
                        <p>Organizations</p>
                    </div>
                    </div>
                <button
                    className="btn btn-primary mt-8"
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
