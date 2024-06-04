import { metadata } from "@/app/layout"
import { SpMode, IndexService, Attestation, DataLocationOffChain } from "@ethsign/sp-sdk"

// let signClient: SignProtocolClient | null = null

// export const getSignClient = (primaryWallet: any) => {
//     // for primary wallet: https://docs.dynamic.xyz/react-sdk/examples/sign-a-message
//     // wrap the original client with a proxy to intergate with dynamic
//     if (!signClient) {
//         const originalClient = new SignProtocolClient(SpMode.OffChain, {
//             signType: OffChainSignType.EvmEip712,
//         })   // + private key 

//         originalClient.client = new Proxy(originalClient.client, {
//             get: function (target, propKey, receiver) {
//                 if (propKey === "getAccount") {
//                     return async function () {
//                         return { address: primaryWallet.address }
//                     }
//                 } else if (propKey === "signTypedData") {
//                     return async function (...args: any[]) {
//                         const data = {
//                             domain: {
//                                 name: "sign.global",
//                                 version: "1",
//                             },
//                             message: args[0].message,
//                             primaryType: args[0].primaryType,
//                             types: {
//                                 EIP712Domain: [
//                                     { name: "name", type: "string" },
//                                     { name: "version", type: "string" },
//                                 ],
//                                 ...args[0].types,
//                             },
//                         }
//                         // const { primaryWallet } = useDynamicContext();
//                         if (!primaryWallet) return
//                         const signer: any = await primaryWallet.connector.getSigner()
//                         if (!signer) return
//                         const signature = await signer.signTypedData({
//                             account: primaryWallet.address,
//                             ...data,
//                         })
//                         return {
//                             message: data,
//                             signature,
//                         }
//                     }
//                 } 
//                 else {
//                     return Reflect.get(target, propKey, receiver)
//                 }
//             },
//         })

//         signClient = originalClient
//     }
//     return signClient
// }

// export const createAttestationSignature = async function (attestation: Attestation, primaryWallet: any) {
//     const client = getSignClient(primaryWallet)
//     const publicKey = primaryWallet.address;
//     const signType = 'eip712';
//     const chain = SpMode.OffChain;
//     const { schemaId, linkedAttestationId, validUntil, recipients, indexingValue, data, dataLocation = DataLocationOffChain.ARWEAVE, } = attestation;
//     const attestationObj = {
//         schemaId,
//         linkedAttestationId: linkedAttestationId || '',
//         validUntil: validUntil || 0,
//         recipients: recipients || [],
//         indexingValue,
//         dataLocation,
//         data: JSON.stringify(data),
//     };
//     const attestationString = JSON.stringify(attestationObj);
//     const schema = await client.getSchema(schemaId);
//     const schemaData = schema?.data;
//     if (!schema) {
//         throw new Error('schema not found');
//     }
//     const signer: any = await primaryWallet.connector.getSigner();
//     const signedData = {
//         domain: {
//             name: "sign.global",
//             version: "1",
//         },
//         message: attestationObj,
//         primaryType: 'Data',
//         types: {
//             EIP712Domain: [
//                 { name: "name", type: "string" },
//                 { name: "version", type: "string" },
//             ],
//             ...{
//                 AttestationData: schemaData,
//                 Data: [
//                     { name: 'schemaId', type: 'string' },
//                     { name: 'linkedAttestationId', type: 'string' },
//                     { name: 'data', type: 'string' },
//                     { name: 'validUntil', type: 'uint32' },
//                     { name: 'recipients', type: 'string[]' },
//                     {
//                         name: 'indexingValue',
//                         type: 'address',
//                     },
//                 ],
//             }
//         },
//     }
//     const signature = await signer.signTypedData({
//         account: primaryWallet.address,
//         ...signedData,
//     })   
//     const message = JSON.stringify(signedData); 
//     return JSON.stringify({
//         signType: 'evm-eip712',
//         publicKey,
//         signature,
//         message,
//         attestation: attestationString,
//     });
// }

export const createAttestationFromMessage = async(message: string) => {
    const url = 'https://mainnet-rpc.sign.global/api/sp/attestations';
    const res = await fetch(url, {
        method: 'POST',
        body: message,
        headers: { 'Content-Type': 'application/json' },
    });
    const resp = await res.json();
    return resp.data;
}


// moved to the certified-sdk package

// export const createCertificationForUser = async (
//     primaryWallet: any,
//     name: string,
//     note: string,
//     certifcationName: string,
//     ceritifcationOrganization: string,
//     IssuedToWallet: string,
//     expirationDate: Date,
//     extra: string,
//     schemaId: any
// ): Promise<any> => {
//     const client = getSignClient(primaryWallet)
//     let txHash: string | null = null


//     const message = await createAttestationSignature({
//         schemaId: schemaId, // TODO: put the schema id in ENV  -> DONE
//         recipients: [ceritifcationOrganization],
//         data: {
//             certificate_id: "", // TODO: generate a certificate id, get the latest from db and add 1
//             certificate_title: certifcationName,
//             issuer_name: ceritifcationOrganization,
//             issue_date: Math.floor(Date.now()),
//             expiration_date: Math.floor(expirationDate.getTime() / 1000),
//             description: note, // TODO add description, now its empty
//             extra: extra,
//             holder_name: name,
//             holder_address: IssuedToWallet,
//             url: "", // TODO: add lookup url
//             metadata: "",
//             signatories: []
//         },
//         indexingValue: primaryWallet.address,
//     }, primaryWallet);
//     const attestationInfo = await createAttestationFromMessage(message);    

//     console.log(attestationInfo)
//     return attestationInfo.attestationId
// }


// combine functionality of 2 functions 'createAttestationSignature' and 'createAttestationFromMessage'
export const createAndSignAttestation = async function (attestation: Attestation, primaryWallet:any, inputSigner: any, schemaData:any) {
    
    
    console.log("createAndSignAttestation:");
    console.log("attestation:", attestation);
    console.log("primaryWallet:", primaryWallet);
    console.log("inputSigner:", inputSigner);
    console.log(typeof inputSigner);

    // const client = getSignClient(primaryWallet)
    const publicKey = primaryWallet.address;
    const signType = 'eip712';
    const chain = SpMode.OffChain;
    const { schemaId, linkedAttestationId, validUntil, recipients, indexingValue, data, dataLocation = DataLocationOffChain.ARWEAVE, } = attestation;
    const attestationObj = {
        schemaId,
        linkedAttestationId: linkedAttestationId || '',
        validUntil: validUntil || 0,
        recipients: recipients || [],
        indexingValue,
        dataLocation,
        data: JSON.stringify(data),
    };
    const attestationString = JSON.stringify(attestationObj);
    // const schema = await client.getSchema(schemaId);
    // const schemaData = schema?.data;
    // if (!schema) {
    //     throw new Error('schema not found');
    // }
    // const signer: any = await primaryWallet.connector.getSigner();
    const signer : any = inputSigner;

    const signedData = {
        domain: {
            name: "sign.global",
            version: "1",
        },
        message: attestationObj,
        primaryType: 'Data',
        types: {
            EIP712Domain: [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
            ],
            ...{
                AttestationData: schemaData,
                Data: [
                    { name: 'schemaId', type: 'string' },
                    { name: 'linkedAttestationId', type: 'string' },
                    { name: 'data', type: 'string' },
                    { name: 'validUntil', type: 'uint32' },
                    { name: 'recipients', type: 'string[]' },
                    {
                        name: 'indexingValue',
                        type: 'address',
                    },
                ],
            }
        },
    }

    const signature = await signer.signMessage({
        account: primaryWallet.address,
        ...signedData,
    })   
    const tempMessage = JSON.stringify(signedData); 
    
    const message = JSON.stringify({
        signType: 'evm-eip712',
        publicKey,
        signature,
        tempMessage,
        attestation: attestationString,
    });


    // functionality of the func createAttestationSignature()
    const url = 'https://mainnet-rpc.sign.global/api/sp/attestations';
    const res = await fetch(url, {
        method: 'POST',
        body: message,
        headers: { 'Content-Type': 'application/json' },
    });
    const resp = await res.json();
    return resp.data;
}







export async function getCertificationTypeFromIndexService(schemaId: string) {
    const indexService = new IndexService("mainnet")
    const res = await indexService.querySchema(schemaId)
    return res
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

export async function getCertificationFromIndexService(attestationId: string) {
    // https://scan.sign.global/attestation/SPA_I10BpEk7iwT4Yfo-YENQj
    const indexService = new IndexService("mainnet")
    const res = await indexService.queryAttestation(attestationId)
    // console.log(res)
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



// // Create a certificate attestation using the template information from the DB
// export const createCertificateAttestation = async (
//     primaryWallet: any,
//     templateInJsonString: string,
// ): Promise<any> => {
    
//     const client = signClient

//     if (!client) {
//         throw new Error("Failed to initialize sign client");
//     }

//     if (!schemaId) {
//         throw new Error("Schema ID is not initialized");
//     }

//     //create attestation
//     const attestationInfo = await client.createAttestation({
//         schemaId: schemaId, //schemaInfo.schemaId or other schemaId
//         data: {
//             extra: templateInJsonString
//         },
//         indexingValue: primaryWallet.address.toLowerCase(),
//     })
//     return attestationInfo.attestationId
// }