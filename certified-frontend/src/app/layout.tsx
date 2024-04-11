import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import DynamicProvider from "@/context/dynamic"
import NavBar from "@/components/Navbar/navBar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Certified App",
    description: "Certified Web App",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" data-theme="cupcake" className="text-info-content">
            <body className={inter.className}>
                <DynamicProvider>
                    <NavBar />
                    {children}
                </DynamicProvider>
            </body>
        </html>
    )
}
