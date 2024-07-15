"use server"

import prisma from "@/lib/prisma/db"
import DisPlayPdf from "@/components/coa/displayPdf"

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

export default async function Page({
    params,
}: {
    params: { attestation: string; edition: number }
}) {
    const coa = await getItem(params.attestation)
    return (
        <div className="w-full h-full fixed z-[1000] bg-white">
            <DisPlayPdf params={params} coa={coa} />
        </div>
    )
}