import NextAuth, { NextAuthOptions, RequestInternal } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { validateJWT } from "./authHelpers"
import { JWT } from "next-auth/jwt"

type User = {
    id: string
    name: string
    email: string
    // Add other fields as needed
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
                        id: jwtPayload.sub ? jwtPayload.sub : "", // Assuming 'sub' is the user ID
                        name: jwtPayload.name || "", // Replace with actual field from JWT payload
                        email: jwtPayload.email || "", // Replace with actual field from JWT payload
                        // Map other fields as needed
                    }

                    // console.log("User Email:", user.email)

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
