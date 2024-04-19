"use server"

import DisplayCertificatePage from "@/components/CertificationDisplay/displayCertificatePage"
import prisma from "@/lib/prisma/db"
import { JsonValue } from "@prisma/client/runtime/library"

export type SchemaDetails = {
    note: JsonValue | undefined
    organizationName: JsonValue | undefined
    certificationName: JsonValue | undefined
}

export type AttestationDisplayRecord = {
    id: number
    name: string
    email: string
    walletAddress: string
    createdAt: string
    updatedAt: Date
    expirationAt: string
    schemaId: string
    schema: SchemaDetails | null
    template: string
    attestationId: string
}

async function getItem(id: string): Promise<AttestationDisplayRecord> {
    const res = await prisma.attestationRecord.findUnique({
        where: {
            id: Number(id),
        },
    })

    if (!res) {
        throw new Error("Item not found")
    }

    if (
        typeof res.schema === "object" &&
        res.schema !== null &&
        "note" in res.schema &&
        "organizationName" in res.schema &&
        "certificationName" in res.schema
    ) {
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
        const attestationRecord: AttestationDisplayRecord = {
            ...res,
            createdAt: formattedCreatedAt,
            expirationAt: formattedExpirationAt,
            schema: {
                note: res.schema.note,
                organizationName: res.schema.organizationName,
                certificationName: res.schema.certificationName,
            },
        }
        return attestationRecord
    } else {
        throw new Error("Schema data is invalid or missing required fields")
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const attestationRecord: AttestationDisplayRecord = await getItem(params.id)
    return (
        <div className="hero min-h-screen bg-base-200 w-full overflow-auto px-[50px]">
            <DisplayCertificatePage attestationRecord={attestationRecord} />
        </div>
    )
}
