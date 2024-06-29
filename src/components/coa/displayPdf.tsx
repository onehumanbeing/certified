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
        console.log(certificateRef.current, coaRecord);
        if (certificateRef.current && coaRecord) {
            // Create an array to store all the image load promises
            const imageLoadPromises: Promise<any>[] = [];
            // Add a promise for each image in the Certificate component
            certificateRef.current.querySelectorAll('img').forEach((imgElement) => {
                console.log(imgElement.src)
                imageLoadPromises.push(new Promise((resolve, reject) => {
                    imgElement.onload = resolve;
                    imgElement.onerror = reject;
                }));
            });
            // Wait for all images to load
            // Promise.all(imageLoadPromises).then(() => {
            var scale = 2;
            const w = 702 * scale;
            const h = certificateRef.current!.offsetHeight * scale;
            console.log(w, h)
            domtoimage
                .toPng(certificateRef.current!, {
                    width: w,
                    height: h,
                    style: {
                        transform: 'scale('+scale+')',
                        transformOrigin: 'top left'
                    }
                })
                .then((dataUrl) => {
                    const img = new Image()
                    img.src = dataUrl

                    img.onload = () => {
                        const canvas = document.createElement("canvas")
                        canvas.width = w
                        canvas.height = h
                        const ctx = canvas.getContext("2d")
                        if (ctx) {
                            // Define the source rectangle
                            const sourceX = 0
                            const sourceY = 0
                            const sourceWidth = img.width
                            const sourceHeight = img.height

                            // Define the destination rectangle
                            const destX = 0
                            const destY = 0
                            const destWidth = w
                            const destHeight = h

                            ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)
                            const dataUrl = canvas.toDataURL("image/png")

                            const imgWidth = w
                            const imgHeight = h
                            const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
                            const pdf = new jsPDF({
                                orientation,
                                unit: "px",
                                format: [imgWidth, imgHeight],
                            })
                            pdf.addImage(dataUrl, "PNG", 0, 0, imgWidth, imgHeight)
                            const pdfBlob = pdf.output("blob")
                            const url = URL.createObjectURL(pdfBlob)
                            pdf.save("certificate.pdf")
                            window.location.href = url
                        }
                    }
                })
                .catch((error) => {
                    console.error("DOM to image conversion failed:", error)
                })
            // })
        }
    }

    useEffect(() => {
        if (coa !== null) {
            const parsedData = JSON.parse(coa?.data!)
            setMetadata(JSON.parse(parsedData.metadata))
            const extraData = JSON.parse(parsedData.extra)
            setExtra(extraData)
            if(params.edition > extraData.editionNumber || params.edition < 1) {
                console.log("edition number out of range")
                return
            }
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
                        materials={metadata.materials}
                        registrationNumber={metadata.registrationNumber}
                        dateOfCertification={metadata.dateOfCertification}
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
