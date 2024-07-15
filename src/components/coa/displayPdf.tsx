"use client"

import { COARecord } from "@/app/coa/[attestation]/[edition]/page"
import CertificateTemplate from "./CertificateTemplate"
import { FC, useEffect, useState, useRef } from "react"

import { jsPDF } from "jspdf"
import html2canvas from "html2canvas-pro"

interface DisPlayPdfProps {
    params: { attestation: string; edition: number }
    coa: COARecord | null
}

const DisPlayPdf: FC<DisPlayPdfProps> = ({ params, coa }) => {
    const [coaRecord, setCoaRecord] = useState<COARecord | null>(null)
    const [metadata, setMetadata] = useState<any>()
    const [extra, setExtra] = useState<any>()

    const contentArea = useRef(null)
    const downloadPdf = () => {
        const input = contentArea.current
        // Increase the scale for a higher resolution canvas
        html2canvas(input!, { scale: 2, useCORS: true }) // Adjust scale as needed
            .then((canvas) => {
                const pdf = new jsPDF({
                    orientation: "landscape",
                    unit: "px",
                    format: [830, 553],
                })
                // Use a higher quality image but with potentially better compression settings
                const imgData = canvas.toDataURL("image/jpeg", 0.9) // Using JPEG for better compression
                // Adjust the dimensions if needed based on the new scale
                pdf.addImage(imgData, "JPEG", 0, 0, 830, 553, undefined, "FAST")
                pdf.save("download.pdf")
            })
    }

    useEffect(() => {
        if (coa !== null) {
            const parsedData = JSON.parse(coa?.data!)
            setMetadata(JSON.parse(parsedData.metadata))
            setExtra(JSON.parse(parsedData.extra))
            setCoaRecord(coa)
        }
    }, [coa])

    useEffect(() => {
        const certificateElement = contentArea.current
        if (certificateElement && coaRecord) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    downloadPdf()
                }, 1000)
            })
        }
    }, [contentArea, coaRecord])

    return (
        <>
            <div className="fixed w-full h-full z-[5000] bg-white"></div>
            {coaRecord && (
                <div style={{ width: "864px", height: "553px" }} ref={contentArea}>
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
            )}
        </>
    )
}

export default DisPlayPdf
