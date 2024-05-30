export const dynamic = "force-dynamic";
import { UserType } from "@/context/userContext";
import prisma from "@/lib/prisma/db";
import { ensureSingleSchema, createCertificateAttestation, getSignClient } from "@/lib/sign";

export async function POST(request: Request) {
    try {
        const userInfoCookie = request.headers
            .get("cookie")
            ?.split("; ")
            .find((row) => row.startsWith("user="))
            ?.split("=")[1];

        if (!userInfoCookie) {
            return new Response(JSON.stringify({ error: "No user info available" }), {
                status: 401,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const userInfo = decodeURIComponent(userInfoCookie);
        const user: UserType = JSON.parse(userInfo);

        const userObject = await prisma.user.findFirst({
            where: {
                OR: [{ dynamic_id: user.id }, { email: user.email }].filter(
                    (item) => Object.values(item)[0] !== undefined
                ),
            },
        });

        if (!userObject) {
            return new Response(JSON.stringify({ error: "Invalid user info format" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const { artworkTitle, artistName, yearOfCompletion, templateId, primaryWallet } = await request.json();

        // Initialize the wallet of the client
        await getSignClient(primaryWallet);

        // Initilaize the only schema used for storing all the certificate template
        await ensureSingleSchema();

        if (!artworkTitle || !artistName || !yearOfCompletion) {
            return new Response(JSON.stringify({ error: "Invalid request" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // the parameter 'templateId' (could be a id or undefined)
        let finalTemplateId = templateId;
        
        // the template content which will be used for attestation creation
        let jsonString;


        if (templateId) {

            // If templateId is provided, fetch the template from the DB
            const existingTemplate = await prisma.certificateTemplate.findUnique({
                where: { id: templateId },
            });

            if (!existingTemplate) {
                return new Response(JSON.stringify({ error: "Template not found" }), {
                    status: 404,
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            }

            jsonString = existingTemplate.templateString;
        
        } else {
            // If no templateId, create a new template and store it in the DB
            jsonString = JSON.stringify({
                artworkTitle,
                artistName,
                yearOfCompletion,
            });

            const newTemplate = await prisma.certificateTemplate.create({
                data: {
                    templateString: jsonString,
                },
            });

            finalTemplateId = newTemplate.id;
        }

        try {
            const attestationId = await createCertificateAttestation(primaryWallet, jsonString);


            // return the result (attestationId and the tempalteId)
            return new Response(JSON.stringify({ attestationId, templateId: finalTemplateId }), {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        } catch (error) {
            console.error("Error creating attestation:", error);
            throw error;
        }
    } catch (error) {
        console.error("Error processing request:", error);
        
        
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
