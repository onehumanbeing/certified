"use client"
import { AttestationDisplayRecord } from "@/app/look-up-certification/[id]/page"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ProfilePageProps {
    attestationRecords: AttestationDisplayRecord[]
}

const ProfilePage: React.FC<ProfilePageProps> = ({ attestationRecords }) => {
    const [attestationPage, setAttestationPage] = useState<number>(1)
    const [attestationRecord, setAttestationRecord] = useState<AttestationDisplayRecord | null>(
        null
    )
    const totalPages = attestationRecords.length
    const { primaryWallet } = useDynamicContext()
    const handleChangePage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setAttestationPage(newPage)
        }
    }
    useEffect(() => {
        if (attestationRecords.length > 0) {
            setAttestationRecord(attestationRecords[attestationPage - 1])
        }
    }, [attestationPage])

    function openCertificationWindowWithParams(
        startTask: string,
        name: string,
        organizationName: string,
        issueYear: number,
        issueMonth: number,
        expirationYear: number,
        expirationMonth: number,
        certUrl: string,
        certId: string
    ) {
        const baseUrl: string = "https://www.linkedin.com/profile/add"
        const queryParams: string =
            `startTask=${encodeURIComponent(startTask)}` +
            `&name=${encodeURIComponent(name)}` +
            `&organizationName=${encodeURIComponent(organizationName)}` +
            `&issueYear=${issueYear}` +
            `&issueMonth=${issueMonth}` +
            `&expirationYear=${expirationYear}` +
            `&expirationMonth=${expirationMonth}` +
            `&certUrl=${encodeURIComponent(certUrl)}` +
            `&certId=${encodeURIComponent(certId)}`
        const fullUrl: string = `${baseUrl}?${queryParams}`

        window.open(fullUrl, "_blank")
    }

    function openTwitterIntent({
        text = "",
        url = "",
        hashtags = "",
    }: {
        text?: string
        url?: string
        hashtags?: string
    }) {
        const baseUrl: string = "https://twitter.com/intent/tweet"
        let queryParams: string[] = []

        if (text) queryParams.push(`text=${encodeURIComponent(text)}`)
        if (url) queryParams.push(`url=${encodeURIComponent(url)}`)
        if (hashtags) queryParams.push(`hashtags=${encodeURIComponent(hashtags)}`)
        const fullUrl: string = `${baseUrl}?${queryParams.join("&")}`

        window.open(fullUrl, "_blank")
    }

    const copyToClipboard = async (text: string): Promise<boolean> => {
        if (!navigator.clipboard) {
            console.error("Clipboard not supported on this browser")
            return false
        }
        try {
            await navigator.clipboard.writeText(text)
            alert("Copied to clipboard")
            return true
        } catch (error) {
            console.error("Failed to copy text: ", error)
            return false
        }
    }

    return (
        <>
            {attestationRecord ? (
                <div className="bg-white p-20 rounded-lg shadow-lg text-center h-auto flex flex-col justify-center align-middle relative w-[850px] cursor-default">
                    {attestationRecord.walletAddress === primaryWallet?.address.toLower() && (
                        <ul className="menu bg-base-300 rounded-box absolute -right-20">
                            <li>
                                <button
                                    className="tooltip tooltip-right"
                                    data-tip="Notate on LinkedIn"
                                    onClick={() => {
                                        openCertificationWindowWithParams(
                                            "certification-name",
                                            attestationRecord.schema?.certificationName as string,
                                            attestationRecord.schema?.organizationName as string,
                                            new Date(attestationRecord.createdAt).getFullYear(),
                                            new Date(attestationRecord.createdAt).getMonth() + 1,
                                            new Date(attestationRecord.expirationAt).getFullYear(),
                                            new Date(attestationRecord.expirationAt).getMonth() +
                                                1,
                                            `https://www.thecertified.xyz/look-up-certification/${attestationRecord.id}`,
                                            attestationRecord.id.toString()
                                        )
                                    }}
                                >
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
                                        className="lucide lucide-linkedin"
                                    >
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                        <rect width="4" height="12" x="2" y="9" />
                                        <circle cx="4" cy="4" r="2" />
                                    </svg>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="tooltip tooltip-right"
                                    data-tip="Share on twitter"
                                    onClick={() => {
                                        openTwitterIntent({
                                            text: `I'm thrilled to share with everyone that I have earned my ${attestationRecord.schema?.certificationName} certification, issued by ${attestationRecord.schema?.organizationName} on Certified!`,
                                            url: `https://www.thecertified.xyz/look-up-certification/${attestationRecord.id}`,
                                            hashtags: "thecertified,blockchain,certification",
                                        })
                                    }}
                                >
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
                                        className="lucide lucide-twitter"
                                    >
                                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                                    </svg>
                                </button>
                            </li>
                            <li>
                                <button
                                    className="tooltip tooltip-right"
                                    data-tip="Share"
                                    onClick={() => {
                                        copyToClipboard(
                                            `https://www.thecertified.xyz/look-up-certification/${attestationRecord.id}`
                                        )
                                    }}
                                >
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
                                        className="lucide lucide-share"
                                    >
                                        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                                        <polyline points="16 6 12 2 8 6" />
                                        <line x1="12" x2="12" y1="2" y2="15" />
                                    </svg>
                                </button>
                            </li>
                        </ul>
                    )}
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
                                <p className="text-lg text-gray-900 font-whisper font-bold">
                                    {attestationRecord.schema?.organizationName as string}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Cert Id:</p>
                                <p className="text-sm text-gray-900">{attestationRecord.id}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Expiration Date:</p>
                                <p className="text-sm text-gray-900">
                                    {attestationRecord.expirationAt}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Issued Date:</p>
                                <p className="text-sm text-gray-900">
                                    {attestationRecord.createdAt}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-5 left-5">
                        <a
                            className="text-[10px] link hover:opacity-80"
                            href={`https://scan.sign.global/attestation/${attestationRecord.attestationId}`}
                            target="_blank"
                        >
                            https://scan.sign.global/attestation/$
                            {attestationRecord.attestationId}
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
            ) : (
                <div>
                    <div className="flex justify-center">
                        <img
                            src="/assets/landing_page_2.png"
                            alt="Certified"
                            className="w-64 h-64"
                        />
                    </div>
                    <h1 className="text-lg font-bold text-center">
                        this user don{"'"}t have any certification issued.
                    </h1>
                    <br />
                    <p className="text-md text-center">
                        contact your organization to issue a certification to you.
                    </p>
                </div>
            )}

            <div className="join fixed bottom-20 left-0 flex justify-center w-full">
                {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleChangePage(index + 1)}
                        className={`join-item btn btn-lg ${
                            attestationPage === index + 1 ? "btn-active" : ""
                        }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </>
    )
}

export default ProfilePage
