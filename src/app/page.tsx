"ued server"
import Hero from "@/components/Landing/hero"
import { formatISO, startOfDay, endOfDay } from "date-fns"

import prisma from "@/lib/prisma/db"

export type recordType = {
    allUsersCount: number
    usersCreatedTodayCount: number
    allSignProtocalSchemasCount: number
    signProtocalSchemasCreatedTodayCount: number
    allAttestationRecordsCount: number
}

async function getItem() {
    const todayStart = startOfDay(new Date())
    const todayEnd = endOfDay(new Date())

    const countAllUsers = await prisma.user.count()

    const countUsersCreatedToday = await prisma.user.count({
        where: {
            createdAt: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
    })

    const countAllSignProtocalSchemas = await prisma.signProtocalSchema.count()

    const countSignProtocalSchemasCreatedToday = await prisma.signProtocalSchema.count({
        where: {
            createdAt: {
                gte: todayStart,
                lte: todayEnd,
            },
        },
    })

    const countAllAttestationRecords = await prisma.attestationRecord.count()

    return {
        allUsersCount: countAllUsers,
        usersCreatedTodayCount: countUsersCreatedToday,
        allSignProtocalSchemasCount: countAllSignProtocalSchemas,
        signProtocalSchemasCreatedTodayCount: countSignProtocalSchemasCreatedToday,
        allAttestationRecordsCount: countAllAttestationRecords,
    }
}

export default async function Home() {
    const record: recordType = await getItem()
    return (
        <div className="lg:py-0 hero bg-base-200 min-h-screen">
            <Hero record={record} />
            <div className=" fixed bottom-1 flex gap-4 w-full text-[12px] justify-center items-center">
                Copyright © {new Date().getFullYear()} Certified. All rights reserved.
            </div>
        </div>
    )
}
