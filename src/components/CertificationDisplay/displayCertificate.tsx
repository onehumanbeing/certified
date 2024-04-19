"use client"
import { AttestationDisplayRecord } from "@/app/look-up-certification/[id]/page"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface DisplayCertificateProps {
    attestationRecord: AttestationDisplayRecord
}

const DisplayCertificate: React.FC<DisplayCertificateProps> = ({ attestationRecord }) => {
    return (
        <div className="bg-white p-20 rounded-lg shadow-lg text-center h-auto flex flex-col justify-center align-middle relative w-[850px] cursor-default">
            <div className="mb-4">
                <div className="flex justify-center"></div>
                <h2 className="text-3xl font-bold text-blue-900 whitespace-pre">
                    {attestationRecord.schema?.certificationName as string}
                </h2>
            </div>
            <div className="mb-8">
                <h1 className="text-4xl text-gray-700">{attestationRecord.name}</h1>
                <div className="mt-2 mb-4 h-1 bg-blue-300 mx-auto w-36"></div>
                <p className="text-gray-600 px-16 py-2">
                    {attestationRecord.schema?.note as string}
                </p>
            </div>
            <div className="text-left">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600">Given by:</p>
                        <p className="text-sm text-gray-900">
                            {attestationRecord.schema?.organizationName as string}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Cert Id:</p>
                        <p className="text-sm text-gray-900">{attestationRecord.id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Expiration Date:</p>
                        <p className="text-sm text-gray-900">{attestationRecord.expirationAt}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Issued Date:</p>
                        <p className="text-sm text-gray-900">{attestationRecord.createdAt}</p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-5 left-5">
                <a
                    className="text-[10px] link hover:opacity-80"
                    href={`https://scan.sign.global/attestation/${attestationRecord.attestationId}`}
                    target="_blank"
                >
                    https://scan.sign.global/attestation/${attestationRecord.attestationId}
                </a>
                <div></div>
            </div>
            <div className="absolute bottom-5 right-5">
                <Image
                    className="w-[90px] h-auto  "
                    src="/assets/certified_logo.png"
                    width={549}
                    height={201}
                    alt="the certified logo"
                />
                <p className="text-[6px]">https://www.thecertified.xyz/</p>
            </div>
        </div>
    )
}

export default DisplayCertificate
