"use server"

import { AttestationDisplayRecord, SchemaDetails } from "@/app/look-up-certification/[id]/page"
import ProfilePage from "@/components/Profile/ProfilePage"
import prisma from "@/lib/prisma/db"

async function getItem(walletAddress: string): Promise<AttestationDisplayRecord[]> {
    try {
        const attestationRecords = await prisma.attestationRecord.findMany({
            where: {
                walletAddress: walletAddress,
            },
        })

        return attestationRecords.map((res) => {
            const formattedCreatedAt = res.createdAt
                ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                  }).format(new Date(res.createdAt))
                : ""

            const formattedExpirationAt = res.expirationAt
                ? new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                  }).format(new Date(res.expirationAt))
                : ""

            let schemaDetails: SchemaDetails | null = null
            if (
                typeof res.schema === "object" &&
                res.schema !== null &&
                "note" in res.schema &&
                "organizationName" in res.schema &&
                "certificationName" in res.schema
            ) {
                schemaDetails = {
                    note: res.schema.note,
                    organizationName: res.schema.organizationName,
                    certificationName: res.schema.certificationName,
                }
            }

            const attestationRecord: AttestationDisplayRecord = {
                id: res.id,
                name: res.name,
                email: res.email,
                walletAddress: res.walletAddress,
                createdAt: formattedCreatedAt,
                updatedAt: res.updatedAt,
                expirationAt: formattedExpirationAt,
                schemaId: res.schemaId,
                schema: schemaDetails,
                template: res.template,
                attestationId: res.attestationId,
            }

            return attestationRecord
        })
    } catch (error) {
        console.error("Error fetching attestation records by wallet address:", error)
        throw error
    }
}

export default async function Page({ params }: { params: { wallet: string } }) {
    const attestationRecords = await getItem(params.wallet)
    return (
        <div className="hero min-h-screen bg-base-200 w-full overflow-auto px-[50px]">
            <ProfilePage attestationRecords={attestationRecords} />
        </div>
    )
}
