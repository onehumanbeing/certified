"use client"
import { useRouter } from "next/navigation"

export default function Hero() {
    const router = useRouter()
    return (
        <div className="hero-content text-center">
            <div className="max-w-md">
                <h1 className="text-5xl font-bold "></h1>
                <p className="py-6">Welcome on aboard</p>
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
