"use server"

import prisma from "@/lib/prisma/db"
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export type COARecord = {
    attestationId: string
    edition: number
    url: string
}

async function getItem(attestationId: string, edition: number): Promise<COARecord | null> {
    const editionNumber = typeof edition === 'string' ? parseInt(edition, 10) : edition;
    const res = await prisma.editionCOA.findFirst({
        where: {
            attestationId: attestationId,
            edition: editionNumber
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

export async function GET(request: Request, { params }: { params: { attestation: string; edition: number } }) {
    const coa = await getItem(params.attestation, params.edition);
    if (coa) {
        return new Response(JSON.stringify({ url: coa.url }), {
            status: 302,
            headers: {
                "Location": coa.url,
                "Content-Type": "application/json",
            },
        });
    }
    else {
        return new Response(JSON.stringify({ error: "COA not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        })
    }
}