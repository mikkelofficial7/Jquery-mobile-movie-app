const ciphertext = "gL+BlN25mO7/Zj9re+B6GMTCzKUVoALwIDmm7un+6W63Kr498V7SzQPVZuhAaJAO"
const iv = "5orUg6E0UVPz7wdl"
const password = "X&tDNHYZ4z[%Ok$=Hk6eNz@6hgm$)vo4zPr-GG<>Hb}pbI90iLr4LWJ@b&M5jQuZFa^{xFb<AE80#VG|;Uv)Ce#oW-1S&A_}~D";

const baseImageLoad = "https://image.tmdb.org/t/p/w300_and_h450_bestv2"
const baseUrl = "https://findyourmovi.vercel.app/"

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function bufferToBase64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuffer(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

async function getKeyFromPassword(password) {
    const keyMaterial = await crypto.subtle.importKey(
    "raw", textEncoder.encode(password),
    { name: "PBKDF2" }, false, ["deriveKey"]
    );

    return crypto.subtle.deriveKey(
    {
        name: "PBKDF2",
        salt: textEncoder.encode("somesalt"), // use a better salt in real use
        iterations: 100000,
        hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
    );
}

async function decryptString(ciphertextBase64, ivBase64, password) {
    const key = await getKeyFromPassword(password);
    const iv = base64ToBuffer(ivBase64);
    const ciphertext = base64ToBuffer(ciphertextBase64);

    const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
    );

    return textDecoder.decode(decrypted);
}