import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const allowedOrigins = [
    "https://www.thecertified.xyz",
    "https://thecerthecertified.xyz",
    "http://localhost:3000"
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
            "Access-Control-Allow-Origin": "*",
            ...corsOptions,
        }
        return NextResponse.json({}, { headers: preflightHeaders })
    }

    const response = NextResponse.next()

    if (isAllowedOrigin) {
        response.headers.set("Access-Control-Allow-Origin", origin)
    }

    return response
}

export const config = {
    matcher: "/api/:path*",
}
