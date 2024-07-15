"use client"

import { COARecord } from "@/app/coa/[attestation]/[edition]/page"
import CertificateTemplate from './CertificateTemplate';
import { FC, useEffect, useState } from "react"

interface DisPlayPdfProps {
    params: { attestation: string; edition: number }
    coa: COARecord | null
}

const DisPlayPdf: FC<DisPlayPdfProps> = ({ params, coa }) => {
    const [coaRecord, setCoaRecord] = useState<COARecord | null>(null)
    const [metadata, setMetadata] = useState<any>()
    const [extra, setExtra] = useState<any>()

    useEffect(() => {
        if (coa !== null) {
            const parsedData = JSON.parse(coa?.data!)
            setMetadata(JSON.parse(parsedData.metadata))
            setExtra(JSON.parse(parsedData.extra))
            setCoaRecord(coa)
        }
    }, [coa])

    return (
        <>
            {coaRecord !== null ? (
                <div className="w-full h-full">
                    <CertificateTemplate
                        artworkTitle={metadata.artworkTitle}
                        artistName={metadata.artistName}
                        yearOfCompletion={metadata.yearOfCompletion}
                        dimensions={metadata.dimensions}
                        editionNumber={`${params.edition}/${extra.editionNumber}`}
                        materials={metadata.materials}
                        registrationNumber={metadata.registrationNumber}
                        dateOfCertification="21/12/2025"
                        signatureImagePath={extra.signatureImageUrl}
                        artworkImagePath={extra.imageUrl}
                        markerImagePath={extra.markerImageUrl}
                        certificateUrl={`https://scan.sign.global/attestation/${coa?.attestationId}`}
                    />
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
                    COA not exist...
                </div>
            )}
        </>
    )
}

export default DisPlayPdf