export const dynamic = "force-dynamic"
import prisma from "@/lib/prisma/db"
import { Prisma } from "@prisma/client"

export interface AttestationRecordInput {
    name: string
    email: string
    walletAddress: string
    expirationAt: Date
    schemaId: string
    attestationId: string
}

export async function POST(request: Request) {
    try {
        const input: AttestationRecordInput = await request.json()
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

        try {
            const signProtocolSchema = await prisma.signProtocalSchema.findUnique({
                where: { schemaId: input.schemaId },
            })

            if (!signProtocolSchema) {
                return new Response(JSON.stringify({ error: "Sign Protocol Schema not found" }), {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                    },
                })
            }

            const schemaData: Prisma.InputJsonValue = JSON.parse(
                JSON.stringify(signProtocolSchema.schema)
            )

            // Create a new attestation record using the fetched schema and template
            const newAttestationRecord = await prisma.attestationRecord.create({
                data: {
                    name: input.name,
                    email: input.email,
                    walletAddress: input.walletAddress,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    expirationAt: input.expirationAt,
                    schemaId: signProtocolSchema.schemaId,
                    attestationId: input.attestationId,
                    schema: schemaData,
                    template: signProtocolSchema.template,
                },
            })

            return new Response(JSON.stringify(newAttestationRecord), {
                status: 201,
                headers: {
                    "Content-Type": "application/json",
                },
            })
        } catch (error) {
            console.error("Error creating attestation record:", error)
            return new Response(JSON.stringify({ error: "Internal Server Error" }), {
                status: 500,
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
