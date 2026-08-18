const KEY_BASE64 = "pPc2H/OrnOmTW7LOCnSkBQ==";
const IV_BASE64 = "GHdnz7UQwnmCMM5Qy0Gu0w==";

function base64ToBytes(base64: string): Uint8Array<ArrayBuffer> {
    const binary = atob(base64);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes;
}

const IV = base64ToBytes(IV_BASE64);

let keyPromise: Promise<CryptoKey> | undefined;

function getKey(): Promise<CryptoKey> {
    keyPromise ??= crypto.subtle.importKey(
        "raw",
        base64ToBytes(KEY_BASE64),
        { name: "AES-CBC" },
        false,
        ["decrypt"],
    );

    return keyPromise;
}

export async function decodeCoordinateBlock(encoded: string): Promise<string> {
    const trimmed = encoded.trim();

    try {
        const cipherBytes = base64ToBytes(trimmed);

        if (cipherBytes.length === 0 || cipherBytes.length % 16 !== 0) {
            return trimmed;
        }

        const plaintext = await crypto.subtle.decrypt(
            { name: "AES-CBC", iv: IV },
            await getKey(),
            cipherBytes,
        );

        return String.fromCharCode(...new Uint8Array(plaintext));
    } catch {
        return trimmed;
    }
}