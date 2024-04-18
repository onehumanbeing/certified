"use client"

import { useEffect, useState } from "react"
import CreateCertification from "../Certifcation/createCertificationBar"
import DisplayCertificationTemplate from "../Certifcation/displayCertifcationTemplate"
import { createCertificationForUser, createCertificationType } from "@/lib/sign"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import DisplayCertification from "../Certifcation/displayCertifcation"
import IssuesCertification from "../Certifcation/IssueCertifcation"
import { AttestationRecordInput } from "@/app/api/func/issue-certificate/route"

type CertificationType = {
    certificationName: string
    note: string
    organizationName: string
}

export type CertificationContentType = {
    schemaId: string
    schema: CertificationType
    template: string
}

export default function Certification() {
    const [activeButton, setActiveButton] = useState<string>("OwnedCertifications")
    const [certificationName, setCertificationName] = useState<string>("")
    const [note, setNote] = useState<string>("")
    const [organizationName, setOrganizationName] = useState<string>("")
    const [alert, setAlert] = useState<"gen" | "sucess" | null>(null)
    const { primaryWallet } = useDynamicContext()
    const [ownedCertifications, setOwnedCertifications] = useState<CertificationContentType[]>([])
    const [selectedCertification, setSelectedCertification] =
        useState<CertificationContentType | null>(null)

    const handleGetCertifications = async () => {
        const userToken = localStorage.getItem("dynamic_authentication_token")
        if (!userToken) {
            return null
        }

        const response = await fetch("/api/func/fetch-template", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JSON.parse(userToken)}`,
            },
        })
        const res = await response.json()
        setOwnedCertifications(res.schemas)
    }

    const handleCreateCertification = async (template: string) => {
        const userToken = localStorage.getItem("dynamic_authentication_token")
        if (!userToken) {
            return null
        }

        if (!primaryWallet) return
        const schemaId = await createCertificationType(certificationName, primaryWallet)
        setAlert("gen")

        let data = {
            schemaId,
            schema: JSON.stringify({ certificationName, note, organizationName }),
            template,
        }

        console.log(data)

        const response = await fetch("/api/func/create-template", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JSON.parse(userToken)}`,
            },
            body: JSON.stringify(data),
        })
        const res = await response.json()
        setAlert("sucess")
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setAlert(null)
        setActiveButton("OwnedCertifications")
    }

    const handleIssueCertification = async (
        schemaId: string,
        name: string,
        certifcationName: string,
        ceritifcationOrganization: string,
        IssuedToWallet: string,
        expirationDate: Date,
        email: string
    ) => {
        const userToken = localStorage.getItem("dynamic_authentication_token")
        if (!userToken) {
            return null
        }
        if (!primaryWallet) return
        const attestationId = await createCertificationForUser(
            primaryWallet,
            schemaId,
            name,
            certifcationName,
            ceritifcationOrganization,
            IssuedToWallet,
            expirationDate
        )

        setAlert("gen")

        let data: AttestationRecordInput = {
            name,
            email,
            expirationAt: expirationDate,
            attestationId,
            walletAddress: IssuedToWallet,
            schemaId,
        }

        console.log(data)

        const response = await fetch("/api/func/issue-certificate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JSON.parse(userToken)}`,
            },
            body: JSON.stringify(data),
        })
        const res = await response.json()
        setAlert("sucess")
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setAlert(null)
        setActiveButton("OwnedCertifications")
    }

    useEffect(() => {
        if (activeButton === "OwnedCertifications") {
            handleGetCertifications()
        }
    }, [activeButton])
    return (
        <>
            <div className="toast toast-top toast-center z-50">
                {alert === "gen" && (
                    <div className="alert alert-info flex justify-center items-center">
                        <span>Creating, please wait...</span>
                        <span className="loading loading-infinity loading-lg"></span>
                    </div>
                )}
                {alert === "sucess" && (
                    <div className="alert alert-success">
                        <span>Certification created successfully.</span>
                    </div>
                )}
            </div>
            <div className="z-0 flex px-12 pt-[100px] pb-[100px] items-center justify-center gap-2 text-center min-h-full w-full overflow-auto">
                {activeButton === "OwnedCertifications" ? (
                    <div className="w-full">
                        {ownedCertifications.length === 0 ? (
                            <div>
                                <h1 className="text-lg font-bold">
                                    You don{"'"}t have any certification ready to be issued.
                                </h1>
                                <br />
                                <button
                                    className="btn btn-neutral"
                                    onClick={() => {
                                        setActiveButton("createNew")
                                    }}
                                >
                                    Create a Certificate Template
                                </button>
                            </div>
                        ) : selectedCertification !== null ? (
                            <IssuesCertification
                                selectedCertification={selectedCertification}
                                setSelectedCertification={setSelectedCertification}
                                handleIssueCertification={handleIssueCertification}
                            />
                        ) : (
                            <div className="flex flex-wrap gap-12 w-full justify-center items-center">
                                {ownedCertifications.map((certification, index) => (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            setSelectedCertification(certification)
                                        }}
                                    >
                                        <DisplayCertification
                                            certificationName={
                                                certification.schema.certificationName
                                            }
                                            note={certification.schema.note}
                                            organizationName={
                                                certification.schema.organizationName
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <main className="flex flex-col gap-4 w-full h-auto">
                        <div className="w-full h-auto flex gap-8">
                            <div className="w-3/4 h-full flex justify-center">
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
                                handleCreateCertification("default")
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
        </>
    )
}
