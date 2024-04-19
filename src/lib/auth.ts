import NextAuth, { NextAuthOptions, RequestInternal } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { validateJWT } from "./authHelpers"
import { JWT } from "next-auth/jwt"

export type User = {
    id: string
    name: string
    email: string
    walletAddress: string
}

interface Auth {
    token?: JWT
    // Add other fields you expect in the auth object
}

export const config: NextAuthOptions = {
    theme: {
        logo: "https://next-auth.js.org/img/logo/logo-sm.png",
    },
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                token: { label: "Token", type: "text" },
            },
            async authorize(
                credentials: Record<"token", string> | undefined,
                request: Pick<RequestInternal, "body" | "query" | "headers" | "method">
            ): Promise<User | null> {
                // Check if credentials are undefined
                if (!credentials || typeof credentials.token !== "string" || !credentials.token) {
                    throw new Error("Token is required and must be a string")
                }

                const token = credentials.token
                // console.log("Token:", token)
                const jwtPayload = await validateJWT(token)

                if (jwtPayload) {
                    // Transform the JWT payload into your user object
                    const user: User = {
                        id: jwtPayload.sub ? jwtPayload.sub : "",
                        name: jwtPayload.name || "",
                        email: jwtPayload.email || "",
                        walletAddress: jwtPayload.verified_credentials[0]["address"] || "",
                        // Map other fields as needed
                    }

                    return user
                } else {
                    return null
                }
            },
        }),
    ],
    callbacks: {
        signIn: async ({ user, account, profile, credentials }) => {
            if (user) {
                // Implement any additional checks if necessary
                return true
            }
            return false // Sign-in is denied
        },
        // You can include other callbacks if needed
    },
}
