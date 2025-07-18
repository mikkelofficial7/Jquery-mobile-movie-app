const ciphertext = "gL+BlN25mO7/Zj9re+B6GMTCzKUVoALwIDmm7un+6W63Kr498V7SzQPVZuhAaJAO"
const cipherGemini = "4LLV8E6s0gD9Z1jFfIt0YmuY8oJ53OvKORJ9makgqyUed3y2Nsq6hniPRj9/jIFY6CBhdeI7eg=="
const iv = "5orUg6E0UVPz7wdl"
const ivGemini = "8EYlvvaIoaqMLXhr"
const password = "X&tDNHYZ4z[%Ok$=Hk6eNz@6hgm$)vo4zPr-GG<>Hb}pbI90iLr4LWJ@b&M5jQuZFa^{xFb<AE80#VG|;Uv)Ce#oW-1S&A_}~D";
const templateGeminiSearch = "I forget the title but can you give me one title that closest to my description: "
const templateGeminiSearchImage = "Give me a movie/tv show title according to this image poster or frame scene: "

// Utility functions
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

function bufferToBase64(buf) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

function base64ToBuffer(base64) {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

// Generate a crypto key from a password
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

// Encrypt a string
async function encryptString(plainText, password) {
    const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
    const key = await getKeyFromPassword(password);

    const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    textEncoder.encode(plainText)
    );

    return {
    ciphertext: bufferToBase64(encrypted),
    iv: bufferToBase64(iv)
    };
}

// Decrypt a string
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

// Example usage
(async () => {
    const text = "test";

    const { ciphertext, iv } = await encryptString(text, password);
    console.log("Encrypted:", ciphertext);
    console.log("IV:", iv);

    const decrypted = await decryptString(ciphertext, iv, password);
    console.log("Decrypted:", decrypted);
})();