export const dynamic = "force-dynamic"
import { UserType } from "@/context/userContext"
import prisma from "@/lib/prisma/db"

export async function GET(request: Request) {
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
            const userWithSchemas = await prisma.user.findUnique({
                where: {
                    email: user.email,
                },
                include: {
                    signProtocols: true,
                },
            })

            if (!userWithSchemas) {
                return new Response(JSON.stringify({ schemas: [] }), {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            }

            const schemas = userWithSchemas.signProtocols.map((protocol) => ({
                schema: protocol.schema,
                schemaId: protocol.schemaId,
                template: protocol.template,
            }))

            return new Response(JSON.stringify({ schemas }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            })
        } catch (error) {
            return new Response(JSON.stringify({ error: "error" }), {
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
