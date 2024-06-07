export const dynamic = "force-dynamic"
import { UserType } from "@/context/userContext"
import prisma from "@/lib/prisma/db"

export async function POST(request: Request) {
    try {
        const { schemaId = "CERT_" + Date.now().toString() + Math.floor(Math.random() * 1000) + Math.random().toString(36).substring(2), schema, template } = await request.json()
        
        if (!schema) {
            return new Response(JSON.stringify({ error: "Invalid request" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            })
        }

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

            const userObject = await prisma.user.findFirst({
                where: {
                    OR: [{ dynamic_id: user.id }, { email: user.email }].filter(
                        (item) => Object.values(item)[0] !== undefined
                    ),
                },
            })

            if (!userObject) {
                return new Response(JSON.stringify({ error: "Invalid user info format" }), {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            }

            try {
                const newSchema = await prisma.signProtocalSchema.create({
                    data: {
                        userId: userObject.id,
                        schemaId,
                        schema: JSON.parse(schema),
                        template,
                    },
                })
            } catch (error) {
                console.error("Error saving SignProtocalSchema:", error)
                throw error
            }

            return new Response(JSON.stringify({ result: true }), {
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
