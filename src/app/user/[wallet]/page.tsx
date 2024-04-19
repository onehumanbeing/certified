"use server"

import prisma from "@/lib/prisma/db"

async function getItem(walletAddress: string) {
    try {
        const attestationRecords = await prisma.attestationRecord.findMany({
            where: {
                walletAddress: walletAddress,
            },
        })
        return attestationRecords
    } catch (error) {
        console.error("Error fetching attestation records by wallet address:", error)
        throw error
    }
}

export default async function Page({ params }: { params: { wallet: string } }) {
    console.log("params", params.wallet)
    const attestationRecords = await getItem(params.wallet)
    console.log("attestationRecords", attestationRecords)
    return <main className="p-4 md:p-10 mx-auto max-w-7xl">{attestationRecords.toString()}</main>
}
