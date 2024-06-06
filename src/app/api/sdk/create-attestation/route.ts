import { UserType } from "@/context/userContext"
import prisma from "@/lib/prisma/db"
import { createAttestationFromMessage } from "@/lib/sign"

// the schema Id in env variables
const schemaId = "SPS_gQTxfuWWqSWp4eB-D28qF"

// Set CORS headers for all requests

export async function POST(request: Request) {
    try {
        // API handler parameters
        const object = await request.json()
        const {
            attester,
            holder_name,
            metadata,
            data
        } = object
        try {
            console.log("Request data:", object)
            const attestationInfo = await createAttestationFromMessage(data)
            // Create a new attestation record using the fetched schema and template
            // const newAttestationRecord = await prisma.attestationRecord.create({
            //     data: {
            //         name: holder_name,
            //         email: "",
            //         walletAddress: attester,
            //         createdAt: new Date(),
            //         updatedAt: new Date(),
            //         expirationAt: "",
            //         schemaId: schemaId as string,
            //         attestationId: attestationInfo.attestationId,
            //         schema: schemaId, // store the schema ID here
            //         template: metadata
            //     },
            // })
            // return the result (attestationId and the templateId)
            return new Response(
                JSON.stringify({
                    attestationId: attestationInfo.attestationId,
                    pdf: "",
                }),
                {
                    status: 200,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            )
        } catch (error) {
            console.error("Error creating attestation:", error)
            throw error
        }
    } catch (error) {
        console.error("Error processing request:", error)
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        })
    }
}
