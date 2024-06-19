"use server"

import {
    Certificate
} from "certified-sdk";
import prisma from "@/lib/prisma/db"

export type COARecord = {
    attestationId: string
    attester: string
    data: string
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
        ...res
    }
    return coa
}

export default async function Page({ params }: { params: { attestation: string, edition: number } }) {
    let coa: COARecord | null = null;
    let data: any;
    let metadata: any;
    let extra: any;

    coa = await getItem(params.attestation);
    if(coa !== null) {
        data = JSON.parse(coa?.data!);
        metadata = JSON.parse(data.metadata);
        extra = JSON.parse(data.extra);
    }
    return (
        <>
            {coa !== null ? (
                <Certificate 
                    artworkTitle={metadata.artworkTitle}
                    artistName={metadata.artistName}
                    yearOfCompletion={metadata.yearOfCompletion}
                    dimensions={metadata.dimensions}
                    editionNumber={`${params.edition}/${extra.editionNumber}`}
                    medium={metadata.medium}
                    registrationNumber={metadata.registrationNumber}
                    dateOfCertification="21/12/2025"
                    signatureImagePath={extra.signatureImageUrl}
                    artworkImagePath={extra.imageUrl}
                    markerImagePath={extra.markerImageUrl}
                    certificateUrl={`https://scan.sign.global/attestation/${coa.attestationId}`}
                />
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
                    COA not exist...
                </div>
            )}
        </>
    )
}
