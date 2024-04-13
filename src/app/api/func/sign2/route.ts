export const dynamic = "force-dynamic"
import { UserType } from "@/context/userContext"
import prisma from "@/lib/prisma/db"

export async function POST(request: Request) {
    try {
        const userInfoCookie = request.headers
            .get("cookie")
            ?.split("; ")
            .find((row) => row.startsWith("user="))
            ?.split("=")[1]

        if (!userInfoCookie) {
            return new Response(JSON.stringify({ error: "No user info available" }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                },
            })
        }

        const userInfo = decodeURIComponent(userInfoCookie)
        try {
            const user: UserType = JSON.parse(userInfo)

            return new Response(JSON.stringify({ user }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            })
        } catch (error) {
            return new Response(JSON.stringify({ error: "Invalid user info format" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            })
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
}
