import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const allowedOrigins = [
    "https://www.thecertified.xyz",
    "https://thecerthecertified.xyz",
    "http://localhost:3000",
    "http://localhost:3001",
    "https://sdk.thecertified.xyz",
]

const corsOptions = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization,  api-key",
}

export async function middleware(req: NextRequest) {
    console.log("Middleware triggered")
    const origin = req.headers.get("origin") ?? ""

    const isAllowedOrigin = allowedOrigins.includes(origin)

    console.log("Origin:", origin)
    console.log("Is allowed origin:", isAllowedOrigin)

    const isPreflight = req.method === "OPTIONS"
    if (isPreflight) {
        const preflightHeaders = {
            "Access-Control-Allow-Origin": "*",
            ...corsOptions,
        }
        console.log("Preflight request detected")
        return new Response(null, {
            status: 204,
            headers: preflightHeaders,
        })
    }
    const response = NextResponse.next()

    if (isAllowedOrigin) {
        console.log("Setting CORS headers")
        response.headers.set("Access-Control-Allow-Origin", origin)
    }

    // const token = req.headers.get("authorization")?.split(" ")[1]

    // if (token == process.env.passToken) {
    //     return response
    // }

    // if (!token) {
    //     return new Response("Authorization token required", { status: 401 })
    // }

    // const apiResponse = await fetch(`${req.nextUrl.origin}/api/validate`, {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //         Authorization: `Bearer ${process.env.passToken}`,
    //     },
    // })

    // if (!apiResponse.ok) {
    //     return new Response("Unauthorized", { status: 401 })
    // }

    // const { decoded } = await apiResponse.json()

    // response.cookies.set(
    //     "user",
    //     JSON.stringify({
    //         id: decoded.sub,
    //         name: decoded.name || "",
    //         email: decoded.email || "",
    //         walletAddress: decoded.verified_credentials[0]["address"] || "",
    //     }),
    //     {
    //         httpOnly: true,
    //         secure: true,
    //         sameSite: "strict",
    //         path: "/",
    //     }
    // )

    return null
}

export const config = {
    matcher: "/api/:path*",
}
