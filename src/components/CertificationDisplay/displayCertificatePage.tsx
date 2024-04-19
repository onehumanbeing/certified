"use client"
import { AttestationDisplayRecord } from "@/app/look-up-certification/[id]/page"
import DisplayCertificate from "./displayCertificate"

interface DisplayCertificatePageProps {
    attestationRecord: AttestationDisplayRecord
}

const DisplayCertificatePage: React.FC<DisplayCertificatePageProps> = ({ attestationRecord }) => {
    return (
        <>
            <DisplayCertificate attestationRecord={attestationRecord} />
            <div className="fixed bottom-5 flex gap-4 w-full justify-center items-center">
                Copyright © {new Date().getFullYear()} Certified. All rights reserved.
            </div>
        </>
    )
}

export default DisplayCertificatePage
