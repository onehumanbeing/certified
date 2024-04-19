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

async function getItem(id: string): Promise<AttestationDisplayRecord | null> {
    const res = await prisma.attestationRecord.findUnique({
        where: {
            id: Number(id),
        },
    })

    if (!res) {
        return null
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
        return null
    }
}

export default async function Page({ params }: { params: { id: string } }) {
    const attestationRecord: AttestationDisplayRecord | null = await getItem(params.id)
    return (
        <>
            {attestationRecord !== null ? (
                <div className="hero min-h-screen bg-base-200 text-[12px] w-full overflow-auto px-[50px]">
                    <DisplayCertificatePage attestationRecord={attestationRecord} />
                </div>
            ) : (
                <div className="hero min-h-screen bg-base-200 text-[12px] w-full overflow-auto px-[50px] flex justify-center gap-4 text-xl font-bold">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-circle-x"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <path d="m15 9-6 6" />
                        <path d="m9 9 6 6" />
                    </svg>
                    Certification not exist...
                </div>
            )}
        </>
    )
}
