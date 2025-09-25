import JSEncrypt from "jsencrypt";

async function encryptWithPublicKey(publicKeyPem: any, data: any) {
    const encoder = new TextEncoder();
    const payload = JSON.stringify(data);

    const encryptor = new JSEncrypt();
    encryptor.setPublicKey(publicKeyPem);
    return encryptor.encrypt(payload);
}

export async function generateToken(publicKeyPem: any, apiData: any) {
    return await encryptWithPublicKey(publicKeyPem, {
        data: apiData,
        time: Date.now(),
    });
}