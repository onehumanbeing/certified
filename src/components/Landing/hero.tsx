"use client"
import { recordType } from "@/app/page"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface HeroProps {
    record: recordType
}

const Hero: React.FC<HeroProps> = ({ record }) => {
    const router = useRouter()
    const getIssuedRangeDate = () => {
        const formatMonth = (date: Date) =>
            `${date.toLocaleString("en-us", { month: "long" })} ${date.getFullYear()}`

        const startMonth = new Date(2024, 3)
        const currentMonth = new Date()

        const monthRange = `${formatMonth(startMonth)} - ${formatMonth(currentMonth)}`

        return monthRange
    }
    return (
        <div className="py-[100px] lg:py-0 lg:hero-content text-center flex w-full flex-col lg:flex-row lg:justify-between">
            <div className="w-full lg:w-1/2 flex justify-center">
                <Image
                    className="w-[300px] lg:w-[800px]"
                    src="/assets/landing.png"
                    width={800}
                    height={800}
                    alt="Logo"
                />
            </div>
            <div className="w-full lg:w-1/2 flex flex-col gap-12 items-center">
                <h1 className="text-lg lg:text-3xl font-bold">
                    Simplifying Certification on Blockchain
                </h1>
                <div className="flex justify-center w-3/5 lg:w-full">
                    <div className="lg:stats shadow overflow-hidden">
                        <div className="stat">
                            <div className="stat-figure text-secondary">
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
                                    className="lucide lucide-creative-commons"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M10 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1" />
                                    <path d="M17 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1" />
                                </svg>
                            </div>
                            <div className="stat-title">License Issued</div>
                            <div className="stat-value">{record.allAttestationRecordsCount}</div>
                            <div className="stat-desc">{getIssuedRangeDate()}</div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
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
                                    className="lucide lucide-users-round"
                                >
                                    <path d="M18 21a8 8 0 0 0-16 0" />
                                    <circle cx="10" cy="8" r="5" />
                                    <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" />
                                </svg>
                            </div>
                            <div className="stat-title">New Users</div>
                            <div className="stat-value">{record.allUsersCount}</div>
                            <div className="stat-desc">
                                ↗︎ {record.usersCreatedTodayCount} (daily)
                            </div>
                        </div>

                        <div className="stat">
                            <div className="stat-figure text-secondary">
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
                                    className="lucide lucide-building-2"
                                >
                                    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                                    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                                    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                                    <path d="M10 6h4" />
                                    <path d="M10 10h4" />
                                    <path d="M10 14h4" />
                                    <path d="M10 18h4" />
                                </svg>
                            </div>
                            <div className="stat-title">Organizations</div>
                            <div className="stat-value">{record.allSignProtocalSchemasCount}</div>
                            <div className="stat-desc">
                                ↗︎ {record.signProtocalSchemasCreatedTodayCount} (daily)
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    className="btn btn-neutral w-[320px]"
                    onClick={() => {
                        router.push("/certification")
                    }}
                >
                    Issue a certificate now
                </button>
            </div>
            <a
                href="https://www.producthunt.com/posts/certified?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-certified"
                target="_blank"
                className="fixed bottom-8 left-5"
            >
                <Image
                    src={
                        "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=453054&theme=neutral"
                    }
                    alt="Certified - Simplifying&#0032;Certification&#0032;on&#0032;Blockchain | Product Hunt"
                    className="w-[250px] h-[54px]"
                    width={250}
                    height={54}
                />
            </a>
        </div>
    )
}

export default Hero
