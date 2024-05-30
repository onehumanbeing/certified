// This could be in middleware.ts at the root or under app/_middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const allowedOrigins = [
    "https://www.thecertified.xyz",
    "https://thecerthecertified.xyz",
    "http://localhost:3000",
]

const corsOptions = {
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function middleware(req: NextRequest) {
    const origin = req.headers.get("origin") ?? ""
    const isAllowedOrigin = allowedOrigins.includes(origin)

    const isPreflight = req.method === "OPTIONS"
    if (isPreflight) {
        const preflightHeaders = {
            ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
            ...corsOptions,
        }
        return NextResponse.json({}, { headers: preflightHeaders })
    }

    const response = NextResponse.next()

    if (isAllowedOrigin) {
        response.headers.set("Access-Control-Allow-Origin", origin)
    }


    // Skip token validation for testing purposes
    /*
    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
        return new Response("Authorization token required", { status: 401 })
    }

    const apiResponse = await fetch(`${req.nextUrl.origin}/api/validate`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    })

    if (!apiResponse.ok) {
        return new Response("Unauthorized", { status: 401 })
    }

    const { decoded } = await apiResponse.json()

    response.cookies.set(
        "user",
        JSON.stringify({
            id: decoded.sub,
            name: decoded.name || "",
            email: decoded.email || "",
            walletAddress: decoded.verified_credentials[0]["address"] || "",
        }),
        {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            path: "/",
        }
    )
    */
    return response
}

export const config = {
    matcher: "/api/func/:path*",
}
