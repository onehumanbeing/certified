import prisma from "@/lib/prisma/db"
import { JsonValue } from "@prisma/client/runtime/library"
import { Suspense } from "react"

type SchemaDetails = {
    note: JsonValue | undefined
    organizationName: JsonValue | undefined
    certificationName: JsonValue | undefined
}

type AttestationRecord = {
    id: number
    name: string
    email: string
    walletAddress: string
    createdAt: Date
    updatedAt: Date
    expirationAt: Date
    schemaId: string
    schema: SchemaDetails | null
    template: string
    attestationId: string
}

async function getItem(id: string): Promise<AttestationRecord> {
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
        const attestationRecord: AttestationRecord = {
            ...res,
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
    const attestationRecord: AttestationRecord = await getItem(params.id)
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Suspense></Suspense> <div>{attestationRecord.walletAddress}</div>
        </main>
    )
}
