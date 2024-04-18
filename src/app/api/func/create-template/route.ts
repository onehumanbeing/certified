export const dynamic = "force-dynamic"
import { UserType } from "@/context/userContext"
import prisma from "@/lib/prisma/db"

export async function POST(request: Request) {
    try {
        const { schemaId, schema, template } = await request.json()

        if (!schemaId || !schema) {
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
                console.log("No user found with the given identifier")
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
                console.log(newSchema)
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
            console.log("Error parsing user info:", error)
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
