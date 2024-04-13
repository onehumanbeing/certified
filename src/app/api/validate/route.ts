import { NextRequest } from "next/server"
import { validateJWT } from "@/lib/authHelpers"

export async function GET(req: NextRequest) {
    const token = req.headers.get("authorization")?.split(" ")[1]

    if (!token) {
        return new Response(JSON.stringify({ error: "Authorization token required" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        })
    }

    try {
        const decoded = await validateJWT(token)
        if (decoded) {
            return new Response(JSON.stringify({ decoded }), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            })
        } else {
            return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            })
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        })
    }
}
