"use client"

import Image from "next/image"
import { CertificationContentType } from "../Landing/certification"
import { useEffect, useState } from "react"
import DatePicker from "react-date-picker"
import "../../style/DatePicker.css"
import "react-calendar/dist/Calendar.css"
import { isEthereumWalletAddress, isValidEmail } from "@/lib/authHelpers"

interface IssuesCertificationProps {
    selectedCertification: CertificationContentType
    setSelectedCertification: React.Dispatch<React.SetStateAction<CertificationContentType | null>>
    handleIssueCertification: (
        schemaId: string,
        name: string,
        certifcationName: string,
        ceritifcationOrganization: string,
        IssuedToWallet: string,
        expirationDate: Date,
        email: string,
        handleGetCertificationRecord: (schemaId: string) => void
    ) => void
}

interface AttestationRecordSchema {
    note: string
    organizationName: string
    certificationName: string
}

interface AttestationRecord {
    id: number
    name: string
    email: string
    walletAddress: string
    createdAt: string // ISO 8601 formatted date string
    updatedAt: string // ISO 8601 formatted date string
    expirationAt: string // ISO 8601 formatted date string
    schemaId: string
    schema: AttestationRecordSchema
    template: string
    attestationId: string
}

const IssuesCertification: React.FC<IssuesCertificationProps> = ({
    selectedCertification,
    setSelectedCertification,
    handleIssueCertification,
}) => {
    const [issueToName, setIssueToName] = useState<string>("")
    const [issueToEmail, setIssueToEmail] = useState<string>("")
    const [issueToWallet, setIssueToWallet] = useState<string>("")
    const [expirationDate, setExpirationDate] = useState<any>(null)
    const [records, setRecords] = useState<AttestationRecord[] | null>(null)

    const formateDate = () => {
        return new Date(expirationDate)
    }

    function formatToLocalTimeWithOptions(
        dateString: string,
        createdAt: boolean,
        expirationAt: boolean
    ) {
        const date = new Date(dateString)
        if (createdAt) {
            return date.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            })
        } else if (expirationAt) {
            return date.toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            })
        }
    }

    const handleGetCertificationRecord = async (schemaId: string) => {
        try {
            const userToken = localStorage.getItem("dynamic_authentication_token")
            if (!userToken) {
                return null
            }

            let data = {
                schemaId,
            }

            const response = await fetch("/api/func/fetch-record", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JSON.parse(userToken)}`,
                },
                body: JSON.stringify(data),
            })
            const res = await response.json()
            setRecords(res.records)
            await new Promise((resolve) => setTimeout(resolve, 2000))
        } catch (error) {
            console.error("Error fetching certification record", error)
        }
    }

    useEffect(() => {
        if (selectedCertification) {
            handleGetCertificationRecord(selectedCertification.schemaId)
        }
    }, [selectedCertification])

    return (
        <div className="flex flex-col gap-6">
            {/* top bar */}
            <div className="flex relative h-[50px] justify-center items-center">
                <button
                    className="btn btn-active btn-ghost w-24 absolute left-0"
                    onClick={() => {
                        setSelectedCertification(null)
                    }}
                >
                    back
                </button>
                <p className="text-lg font-semibold">You are issuing this certification to</p>
            </div>
            {/* issuing */}
            <div className="flex gap-20 justify-between relative">
                <div className="bg-white p-20 rounded-lg shadow-lg text-center h-auto flex flex-col justify-center align-middle relative w-3/5">
                    <div className="mb-4">
                        <div className="flex justify-center"></div>
                        <h2 className="text-3xl font-bold text-blue-900 whitespace-pre">
                            {selectedCertification.schema.certificationName}
                        </h2>
                    </div>
                    <div className="mb-8">
                        <h1 className="text-4xl text-gray-700">
                            {issueToName ? issueToName : "xx xxx"}
                        </h1>
                        <div className="mt-2 mb-4 h-1 bg-blue-300 mx-auto w-36"></div>
                        <p className="text-gray-600 px-16 py-2">
                            {selectedCertification.schema.note}
                        </p>
                    </div>

                    <div className="text-left">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-600">Given by:</p>
                                <p className="text-lg text-gray-900 font-whisper font-bold">
                                    {selectedCertification.schema.organizationName}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Issued Date:</p>
                                <p className="text-sm text-gray-900">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
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
                <div className="w-2/5 flex flex-col gap-8 justify-center">
                    <label className="input input-bordered flex items-center gap-2">
                        Name
                        <input
                            type="text"
                            className="grow"
                            placeholder="Justin Bieber"
                            onChange={(e) => {
                                setIssueToName(e.target.value)
                            }}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        Email
                        <input
                            type="email"
                            className="grow"
                            placeholder="example@site.com"
                            onChange={(e) => {
                                setIssueToEmail(e.target.value)
                            }}
                        />
                    </label>
                    <span className="indicator-item badge badge-primary -mb-10 ml-auto z-10">
                        key to look up
                    </span>
                    <label className="input input-bordered flex items-center gap-2">
                        EVM Wallet Address
                        <input
                            type="text"
                            className="grow"
                            placeholder="0x35...FE88"
                            onChange={(e) => {
                                setIssueToWallet(e.target.value)
                            }}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        Expiration Date
                        <div className="w-[60%] flex justify-center">
                            <DatePicker
                                onChange={setExpirationDate}
                                format="y-MM-dd"
                                value={expirationDate}
                            />
                        </div>
                    </label>
                    <button
                        className="btn btn-active btn-neutral"
                        disabled={
                            !issueToEmail || !issueToWallet || !issueToName || !expirationDate
                        }
                        onClick={async () => {
                            if (isValidEmail(issueToEmail) === false) {
                                alert("Invalid email address")
                                return
                            }
                            if (isEthereumWalletAddress(issueToWallet) === false) {
                                alert("Invalid wallet address")
                                return
                            }
                            const expirationDate = formateDate()
                            handleIssueCertification(
                                selectedCertification.schemaId,
                                issueToName,
                                selectedCertification.schema.certificationName,
                                selectedCertification.schema.organizationName,
                                issueToWallet,
                                expirationDate,
                                issueToEmail,
                                handleGetCertificationRecord
                            )
                        }}
                    >
                        Issue
                    </button>
                    <a
                        className="link"
                        href={`https://scan.sign.global/schema/SPS_gQTxfuWWqSWp4eB-D28qF`}
                        target="_blank"
                    >
                        check this certification issuing activity on chain
                    </a>
                </div>
            </div>
            {/* record */}
            {records != null && records.length != 0 && (
                <>
                    <div className="flex relative justify-center items-center">
                        <p className="text-lg font-semibold">Certification Issuing History</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Issued to wallet</th>
                                    <th>Issued at</th>
                                    <th>Expiration at</th>
                                    <th>Cert id</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records?.map((record, index) => (
                                    <tr
                                        key={record.id}
                                        className={`cursor-pointer ${
                                            index / 2 === 0 && "bg-base-300"
                                        }`}
                                        onClick={() => {
                                            window.open(`/look-up-certification/${record.id}`)
                                        }}
                                    >
                                        <th>{index + 1}</th>
                                        <td>{record.name}</td>
                                        <td>{record.email}</td>
                                        <td>{record.walletAddress}</td>
                                        <td>
                                            {formatToLocalTimeWithOptions(
                                                record.createdAt,
                                                true,
                                                false
                                            )}
                                        </td>
                                        <td>
                                            {formatToLocalTimeWithOptions(
                                                record.expirationAt,
                                                false,
                                                true
                                            )}
                                        </td>
                                        <td>{record.id}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    )
}

export default IssuesCertification
