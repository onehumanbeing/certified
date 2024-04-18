"use client"

import { useState } from "react"
import CreateCertification from "../Certifcation/createCertificationBar"
import DisplayCertificationTemplate from "../Certifcation/displayCertifcationTemplate"
import { createCertificationType } from "@/lib/sign"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"

export default function Certification() {
    const [activeButton, setActiveButton] = useState<string>("OwnedCertifications")
    const [certificationName, setCertificationName] = useState<string>("")
    const [note, setNote] = useState<string>("")
    const [organizationName, setOrganizationName] = useState<string>("")
    const { primaryWallet } = useDynamicContext()

    const handleCreateCertification = async () => {
        console.log("1")

        const primaryWalletAddress = primaryWallet?.address
        if (!primaryWalletAddress) return
        const res = await createCertificationType(organizationName, primaryWalletAddress)
        console.log(res)
    }

    return (
        <div className="flex flex-col hero-content text-center h-full w-full">
            {activeButton === "OwnedCertifications" ? (
                <>d</>
            ) : (
                <main className="flex flex-col gap-4 w-full h-auto">
                    <div className="w-full h-auto flex gap-8 ">
                        <div className="w-3/4 h-full ">
                            <DisplayCertificationTemplate
                                certificationName={certificationName}
                                note={note}
                                organizationName={organizationName}
                            />
                        </div>
                        <CreateCertification
                            certificationName={certificationName}
                            setCertificationName={setCertificationName}
                            note={note}
                            setNote={setNote}
                            organizationName={organizationName}
                            setOrganizationName={setOrganizationName}
                        />
                    </div>
                    <button
                        disabled={!certificationName || !note || !organizationName}
                        onClick={() => {
                            console.log(1)
                            handleCreateCertification()
                        }}
                        className="btn btn-active btn-xs sm:btn-sm md:btn-md lg:btn-lg"
                    >
                        Create Certificate Template
                    </button>
                </main>
            )}
            <div className="btm-nav">
                <button
                    className={activeButton === "OwnedCertifications" ? "active" : ""}
                    onClick={() => setActiveButton("OwnedCertifications")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                    </svg>
                    <span className="btm-nav-label">Issuing Certificate</span>
                </button>
                <button
                    className={activeButton === "createNew" ? "active" : ""}
                    onClick={() => setActiveButton("createNew")}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2 a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                    <span className="btm-nav-label">Create Certificate Template</span>
                </button>
            </div>
        </div>
    )
}
