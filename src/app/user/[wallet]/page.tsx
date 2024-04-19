import { Suspense } from "react"

interface Data {}

async function getItem(wallet: string) {
    //   const res = await fetch(
    //     `${process.env.NEXT_PUBLIC_ENDPOINT}/data_tracker/sophon/account/${address}/`,
    //     {
    //       next: { revalwalletate: 15 }
    //     }
    //   );

    //   const data: Data[] = await res.json();
    return wallet
}

export default async function Page({ params }: { params: { wallet: string } }) {
    const wallet = await getItem(params.wallet)
    console.log("wallet", wallet)
    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Suspense></Suspense>
        </main>
    )
}
