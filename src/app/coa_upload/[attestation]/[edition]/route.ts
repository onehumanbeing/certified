"use server"

import prisma from "@/lib/prisma/db"
import { put } from '@vercel/blob';

export type COARecord = {
    attestationId: string
    attester: string
    data: any
}

async function getItem(attestationId: string): Promise<COARecord | null> {
    const res = await prisma.cOARecord.findUnique({
        where: {
            attestationId: attestationId,
        },
    })
    if (!res) {
        return null
    }
    const coa: COARecord = {
        ...res,
    }
    return coa
}

export async function POST(request: Request, { params }: { params: { attestation: string; edition: number } }) {
    try {
        // verify the api key
        const apiKey = request.headers.get("api-key");
        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API key is required" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }
        // Check if the API key exists in the database
        const existingApiKey = await prisma.apiKeyTable.findUnique({
            where: { apiKey },
        });
        if (!existingApiKey) {
            return new Response(JSON.stringify({ error: "Invalid API key"}), {
                status: 401,
                headers: {
                    "Content-Type": "application/json"
                },
            });
        }
        const coa = getItem(params.attestation)
        if(coa === null) {
            return new Response(JSON.stringify({status: 1, msg: "attestaion not exists"}), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                    // "Access-Control-Allow-Origin": "*"
                },
            });
        }
        const edition = typeof params.edition === 'string' ? parseInt(params.edition, 10) : params.edition;
        if(edition <= 0) {
            return new Response(JSON.stringify({status: 1, msg: "edition number not unvalid"}), {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                    // "Access-Control-Allow-Origin": "*"
                },
            });
        }
        const filename = "coa.pdf";
        const { url } = await put(filename, request.body!, {
            access: 'public',
        });
        
        const existingRecord = await prisma.editionCOA.findFirst({
            where: {
                attestationId: params.attestation,
                edition: edition,
            },
        });

        if (existingRecord) {
            const updatedRecord = await prisma.editionCOA.update({
                where: { id: existingRecord.id },
                data: {
                    url: url, 
                },
            });
        } else {
            const newRecord = await prisma.editionCOA.create({
                data: {
                attestationId: params.attestation,
                edition: edition,
                url: url,
                },
            });
        }
        
        return new Response(JSON.stringify({status: 0, msg: "success"}), {
            status: 200,
            headers: {
                "Content-Type": "application/json"
                // "Access-Control-Allow-Origin": "*"
            },
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ status: 1, error: "Internal Server Error" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
                // "Access-Control-Allow-Origin": "*"
            },
        });
    }
}