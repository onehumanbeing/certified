import type { Metadata } from "next"
import "./globals.css"
import DynamicProvider from "@/context/dynamic"
import NavBar from "@/components/Navbar/navBar"
import { UserProvider } from "@/context/userContext"
import { Analytics } from "@vercel/analytics/next"
import ThemeDropDown from "@/components/Navbar/themeDropDown"

export const metadata: Metadata = {
    title: "Certified",
    description: "Making Certification Simple",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" data-theme="cupcake">
            <body className="">
                <UserProvider>
                    <DynamicProvider>
                        <NavBar />
                        {children}
                        {/* <ThemeDropDown /> */}
                        <Analytics />
                    </DynamicProvider>
                </UserProvider>
            </body>
        </html>
    )
}
