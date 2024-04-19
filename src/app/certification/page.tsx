"use client"
import Certification from "@/components/Landing/certification"

export default function Home() {
    return (
        <div className="hero min-h-screen bg-base-200">
            <Certification />
            <div className="fixed lg:hidden w-full h-full bg-base-200 flex justify-center items-center flex-col gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-monitor-check"
                >
                    <path d="m9 10 2 2 4-4" />
                    <rect width="20" height="14" x="2" y="3" rx="2" />
                    <path d="M12 17v4" />
                    <path d="M8 21h8" />
                </svg>
                <p className="font-semibold">Please use desktop to issue a certificate</p>
            </div>
        </div>
    )
}
