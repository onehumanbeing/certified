import { UserType } from "@/context/userContext"
import prisma from "@/lib/prisma/db"
import { createAttestationFromMessage } from "@/lib/sign"
import { parseJSON } from "date-fns"
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
            const attestation = JSON.parse(data).attestation;
            const attestationData = JSON.parse( JSON.parse(attestation).data )
            const extraData = JSON.parse(attestationData.extra)
            console.log("attestation: ", attestationData);
            const attestationInfo = await createAttestationFromMessage(data)
            // Create a new attestation record using the fetched schema and template
            /*
            attestationId      String             @unique
            attester           String
            data               String
            edition            Int                @default(0) 
             extra: '{"signatureImageUrl":"https://sdk-static.thecertified.xyz/test_signature.png","markerImageUrl":"https://sdk-static.thecertified.xyz/test_markerImage.png","logoImageUrl":"https://sdk-static.thecertified.xyz/test_image.png","editionNumber":10}',

            */
            const newCOARecord = await prisma.cOARecord.create({
                data: {
                    attestationId: attestationInfo.attestationId,
                    attester: attester,
                    data: JSON.parse(attestation).data,
                    edition: extraData.editionNumber,
                },
            })
            // return the result (attestationId and the templateId)
            return new Response(
                JSON.stringify({
                    attestationId: attestationInfo.attestationId,
                    pdf: `https://sdk.thecertified.xyz/coa/${attestationInfo.attestationId}/`,
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
