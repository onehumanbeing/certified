import crypto from "crypto"
import { revalidatePath } from "next/cache"

export async function POST(request: Request) {

    return new Response("Success!", {
        status: 200,
    })
}
