import jwt, { JwtPayload, Secret, VerifyErrors } from "jsonwebtoken"
import { isValidAddress } from "ethereumjs-util"

export const getKey = (
    headers: any,
    callback: (err: Error | null, key?: Secret) => void
): void => {
    const options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.NEXT_DYNAMIC_BEARER_TOKEN}`,
        },
    }

    console.log("autoHelpers.ts,process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID:", process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID);

    fetch(
        `https://app.dynamicauth.com/api/v0/environments/${process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID}/keys`,
        options
    )
        .then((response) => {
            return response.json()
        })
        .then((json) => {
            const publicKey = json.key.publicKey
            const pemPublicKey = Buffer.from(publicKey, "base64").toString("ascii")
            callback(null, pemPublicKey) // Pass the public key to the callback
        })
        .catch((err) => {
            console.error(err)
            callback(err) // Pass the error to the callback
        })
}

export const validateJWT = async (token: string): Promise<JwtPayload | null> => {
    try {

        console.log("autoHelpers.ts,token:", token);
        console.log("autoHelpers.ts,getkey:", getKey);

        return await new Promise((resolve, reject) => {
            jwt.verify(
                token,
                getKey,
                { algorithms: ["RS256"] },
                (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
                    if (err) {
                        return reject(err)
                    }
                    if (typeof decoded === "object" && decoded !== null) {
                        resolve(decoded as JwtPayload)
                    } else {
                        reject(new Error("Invalid token"))
                    }
                }
            )
        })
    } catch (error) {
        console.error("Invalid token:", error)
        return null
    }
}

export const isEthereumWalletAddress = (address: string): boolean => {
    return isValidAddress(address)
}

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /.+@.+\..+/
    return emailRegex.test(email)
}
