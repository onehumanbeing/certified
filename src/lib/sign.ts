import { SignProtocolClient, SpMode, OffChainSignType, IndexService } from "@ethsign/sp-sdk"

let signClient: SignProtocolClient | null = null

export const getSignClient = (primaryWallet: any) => {
    // for primary wallet: https://docs.dynamic.xyz/react-sdk/examples/sign-a-message
    // wrap the original client with a proxy to intergate with dynamic
    if (!signClient) {
        const originalClient = new SignProtocolClient(SpMode.OffChain, {
            signType: OffChainSignType.EvmEip712,
        })

        originalClient.client = new Proxy(originalClient.client, {
            get: function (target, propKey, receiver) {
                if (propKey === "getAccount") {
                    return async function () {
                        return { address: primaryWallet.address }
                    }
                } else if (propKey === "signTypedData") {
                    return async function (...args: any[]) {
                        const data = {
                            domain: {
                                name: "sign.global",
                                version: "1",
                            },
                            message: args[0].message,
                            primaryType: args[0].primaryType,
                            types: {
                                EIP712Domain: [
                                    { name: "name", type: "string" },
                                    { name: "version", type: "string" },
                                ],
                                ...args[0].types,
                            },
                        }
                        // const { primaryWallet } = useDynamicContext();
                        if (!primaryWallet) return
                        console.log("primaryWallet", primaryWallet)
                        const signer: any = await primaryWallet.connector.getSigner()
                        if (!signer) return
                        const signature = await signer.signTypedData({
                            account: primaryWallet.address,
                            ...data,
                        })
                        return {
                            message: data,
                            signature,
                        }
                    }
                } else {
                    return Reflect.get(target, propKey, receiver)
                }
            },
        })

        signClient = originalClient
    }
    return signClient
}

export const createCertificationType = async (certifcationName: string, primaryWallet: any) => {
    console.log("createCertificationType", certifcationName, primaryWallet)
    const client = getSignClient(primaryWallet)
    console.log("client")
    const res = await client.createSchema({
        name: "License",
        data: [{ name: "signer", type: "address" }],
    })
    console.log(res)
    return res
    // {schemaId: 'SPS_kCoVw8Qo_1s4IZKE7eEZT'}schemaId: "SPS_kCoVw8Qo_1s4IZKE7eEZT"[[Prototype]]: Object
    // for users: https://scan.sign.global/schema/SPS_kCoVw8Qo_1s4IZKE7eEZT
}

export const createCertificationForUser = async (primaryWallet: any): Promise<any> => {
    const client = getSignClient(primaryWallet)
    let txHash: string | null = null

    //create attestation
    const attestationInfo = await client.createAttestation({
        schemaId: "SPS_kCoVw8Qo_1s4IZKE7eEZT", //schemaInfo.schemaId or other schemaId
        data: { signer: "henryyuan" },
        indexingValue: primaryWallet.address.toLowerCase(),
    })
    console.log(attestationInfo)
    // {attestationId: 'SPA_I10BpEk7iwT4Yfo-YENQj'}
    return attestationInfo
}

export async function getCertificationTypeFromIndexService() {
    const indexService = new IndexService("mainnet")
    const res = await indexService.querySchema("SPS_kCoVw8Qo_1s4IZKE7eEZT")
    console.log(res)
    /* 
    {
        id: 'SPS_kCoVw8Qo_1s4IZKE7eEZT',
        mode: 'offchain',
        chainType: 'offchain',
        chainId: 'arweave',
        schemaId: 'SPS_kCoVw8Qo_1s4IZKE7eEZT',
        transactionHash: 'K5WTczNzfXiUmttITNvAA7uXSAQvfJGYu6qJIjzvOR4',
        name: 'License',
        description: '',
        revocable: true,
        maxValidFor: '0',
        resolver: '',
        registerTimestamp: '1713078919926',
        registrant: '0xBa0E5A2eE6Bbc4932938FF96582eD84e45ED52d0',
        data: [ { name: 'signer', type: 'address' } ]
    }
    */
}

export async function getCertificationFromIndexService() {
    // https://scan.sign.global/attestation/SPA_I10BpEk7iwT4Yfo-YENQj
    const indexService = new IndexService("mainnet")
    const res = await indexService.queryAttestation("SPA_I10BpEk7iwT4Yfo-YENQj")
    console.log(res)
    /*
    {
    "id": "SPA_I10BpEk7iwT4Yfo-YENQj",
    "mode": "offchain",
    "chainType": "offchain",
    "chainId": "arweave",
    "attestationId": "SPA_I10BpEk7iwT4Yfo-YENQj",
    "transactionHash": "99WjBjSXIRnIbEH86rjSkOtyu2eCTxjHa0Ua1UM9TXU",
    "indexingValue": "0xba0e5a2ee6bbc4932938ff96582ed84e45ed52d0",
    "schemaId": "SPS_kCoVw8Qo_1s4IZKE7eEZT",
    "fullSchemaId": "SPS_kCoVw8Qo_1s4IZKE7eEZT",
    "linkedAttestation": "",
    "attester": "0xBa0E5A2eE6Bbc4932938FF96582eD84e45ED52d0",
    "from": "0xBa0E5A2eE6Bbc4932938FF96582eD84e45ED52d0",
    "attestTimestamp": "1713079557563",
    "validUntil": "0",
    "revoked": false,
    "revokeTimestamp": null,
    "revokeReason": null,
    "revokeTransactionHash": null,
    "data": "{\"signer\":\"henryyuan\"}",
    "dataLocation": "arweave",
    "extra": {},
    "syncAt": "1713079569892",
    "lastSyncAt": null,
    "recipients": [],
    "schema": {
        "id": "SPS_kCoVw8Qo_1s4IZKE7eEZT",
        "mode": "offchain",
        "chainType": "offchain",
        "chainId": "arweave",
        "schemaId": "SPS_kCoVw8Qo_1s4IZKE7eEZT",
        "transactionHash": "K5WTczNzfXiUmttITNvAA7uXSAQvfJGYu6qJIjzvOR4",
        "name": "License",
        "description": "",
        "dataLocation": "arweave",
        "revocable": true,
        "maxValidFor": "0",
        "resolver": "",
        "registerTimestamp": "1713078919926",
        "registrant": "0xBa0E5A2eE6Bbc4932938FF96582eD84e45ED52d0",
        "data": [
            {
                "name": "signer",
                "type": "address"
            }
        ],
        "originalData": "[{\"name\":\"signer\",\"type\":\"address\"}]",
        "extra": {},
        "syncAt": "1713078926832"
    }
    */
}

// TODO: revoke attestation
