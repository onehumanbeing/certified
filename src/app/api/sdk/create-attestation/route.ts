export const dynamic = "force-dynamic"
import { UserType } from "@/context/userContext"
import prisma from "@/lib/prisma/db"
import { createAttestationFromMessage } from "@/lib/sign"

// the schema Id in env variables
const schemaId = process.env.NEXT_SCHEMA_ID || "SPS_1FrzuMh2iOIHf6X1NFmRo"

// Set CORS headers for all requests
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
}

export async function POST(request: Request) {
    console.log("here")
    // if (request.method === 'OPTIONS') {
    //     // For preflight requests, we send a 200 status with the CORS headers
    //     return new Response(null, {
    //         status: 200,
    //         headers,
    //     });
    // }

    try {
        // API handler parameters
        const object = await request.json()
        const {
            name,
            note,
            certificationName,
            certificationOrganization,
            IssuedToWallet,
            expirationDate,
            extra,
            templateId,
            userInput,
            createAttestationMessage,
        } = object
        console.log("request.json()", object)

        let missingFields = []

        // check if any request parameter or the schemaId from Env Var is missing
        if (!name) missingFields.push("name")
        if (!note) missingFields.push("note")
        if (!certificationName) missingFields.push("certificationName")
        if (!certificationOrganization) missingFields.push("ceritifcationOrganization")
        if (!IssuedToWallet) missingFields.push("IssuedToWallet")
        if (!expirationDate) missingFields.push("expirationDate")
        if (!schemaId) missingFields.push("schemaId")
        if (!extra) missingFields.push("extra")
        // if (!templateId) missingFields.push('templateId');
        if (!userInput) missingFields.push("userInput")

        console.log("missingFields", missingFields)

        // if (missingFields.length > 0) {
        //     return new Response(JSON.stringify({ error: `Invalid request, missing fields: ${missingFields.join(', ')}` }), {
        //         status: 400,
        //         headers: {
        //             "Content-Type": "application/json",
        //             "Access-Control-Allow-Origin": "*"
        //         },
        //     });
        // }

        console.log("passed checking input parameters.")

        // the parameter 'templateId' (could be a id or undefined)
        let finalTemplateId = templateId

        // the template content which will be used for attestation creation
        let extraTemplateString

        if (templateId) {
            // If templateId is provided, fetch the template from the DB
            const existingTemplate = await prisma.certificateTemplate.findUnique({
                where: { id: templateId },
            })

            if (!existingTemplate) {
                return new Response(JSON.stringify({ error: "Template not found" }), {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                })
            }

            extraTemplateString = existingTemplate.templateString
        } else {
            // If no templateId, create a new template and store it in the DB
            const newTemplate = await prisma.certificateTemplate.create({
                data: {
                    templateString: extra,
                },
            })

            finalTemplateId = newTemplate.id
            extraTemplateString = extra
        }

        try {
            const attestationInfo = await createAttestationFromMessage(createAttestationMessage)
            console.log("route.ts, attestationInfo:", attestationInfo)

            // Create a new attestation record using the fetched schema and template
            const newAttestationRecord = await prisma.attestationRecord.create({
                data: {
                    name: userInput.name || "",
                    email: userInput.email || "",
                    walletAddress: userInput.walletAddress.toLowerCase(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    expirationAt: new Date(expirationDate),
                    schemaId: schemaId as string,
                    attestationId: attestationInfo.attestationId,
                    schema: schemaId, // store the schema ID here
                    template: extraTemplateString,
                },
            })

            // return the result (attestationId and the templateId)
            return new Response(
                JSON.stringify({
                    attestationId: attestationInfo.attestationId,
                    templateId: finalTemplateId,
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
