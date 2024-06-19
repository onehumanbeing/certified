"use client"

import { COARecord } from "@/app/coa/[attestation]/[edition]/page"
import { Certificate } from "certified-sdk"
import { FC, useEffect, useRef, useState } from "react"
import domtoimage from "dom-to-image"
import jsPDF from "jspdf"
import { useRouter } from "next/navigation"

interface DisPlayPdfProps {
    params: { attestation: string; edition: number }
    coa: COARecord | null
}

const DisPlayPdf: FC<DisPlayPdfProps> = ({ params, coa }) => {
    const [coaRecord, setCoaRecord] = useState<COARecord | null>(null)
    const [metadata, setMetadata] = useState<any>()
    const [extra, setExtra] = useState<any>()
    const certificateRef = useRef<HTMLDivElement>(null)
    const router = useRouter()

    const generatePdf = () => {
        if (certificateRef.current && coaRecord) {
            domtoimage
                .toPng(certificateRef.current)
                .then((dataUrl) => {
                    const img = new Image()
                    img.src = dataUrl

                    img.onload = () => {
                        const canvas = document.createElement("canvas")
                        canvas.width = img.height
                        canvas.height = img.width

                        const ctx = canvas.getContext("2d")
                        if (ctx) {
                            ctx.translate(img.height / 2, img.width / 2)
                            ctx.rotate((90 * Math.PI) / 180)
                            ctx.drawImage(img, -img.width / 2, -img.height / 2)

                            const rotatedDataUrl = canvas.toDataURL("image/png")

                            const rotatedImg = new Image()
                            rotatedImg.src = rotatedDataUrl

                            rotatedImg.onload = () => {
                                const croppedCanvas = document.createElement("canvas")
                                const croppedCtx = croppedCanvas.getContext("2d")

                                if (croppedCtx) {
                                    const cropWidth = rotatedImg.width
                                    const cropHeight = certificateRef.current!.clientHeight + 127

                                    croppedCanvas.width = cropWidth
                                    croppedCanvas.height = cropHeight

                                    croppedCtx.drawImage(
                                        rotatedImg,
                                        0,
                                        0,
                                        cropWidth,
                                        cropHeight,
                                        0,
                                        0,
                                        cropWidth,
                                        cropHeight
                                    )

                                    const croppedDataUrl = croppedCanvas.toDataURL("image/png")

                                    const pdfWidth = cropWidth
                                    const pdfHeight = cropHeight

                                    const pdf = new jsPDF({
                                        unit: "px",
                                        format: [pdfWidth, pdfHeight],
                                    })

                                    pdf.addImage(croppedDataUrl, "PNG", 0, 0, pdfWidth, pdfHeight)

                                    const pdfBlob = pdf.output("blob")
                                    const url = URL.createObjectURL(pdfBlob)
                                    router.push(url)
                                }
                            }
                        }
                    }
                })
                .catch((error) => {
                    console.error("DOM to image conversion failed:", error)
                })
        }
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
        const certificateElement = certificateRef.current
        if (certificateElement && coaRecord) {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    generatePdf()
                }, 1000)
            })
        }
    }, [certificateRef, coaRecord])

    return (
        <>
            <div className="w-full h-full bg-white fixed z-50"></div>
            {coaRecord && (
                <div ref={certificateRef}>
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
                        certificateUrl={`https://scan.sign.global/attestation/${coa?.attestationId}`}
                    />
                </div>
            )}
        </>
    )
}

export default DisPlayPdf
