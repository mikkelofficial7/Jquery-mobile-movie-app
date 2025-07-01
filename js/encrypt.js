const ciphertext = "gL+BlN25mO7/Zj9re+B6GMTCzKUVoALwIDmm7un+6W63Kr498V7SzQPVZuhAaJAO"
const cipherGemini = "4LLV8E6s0gD9Z1jFfIt0YmuY8oJ53OvKORJ9makgqyUed3y2Nsq6hniPRj9/jIFY6CBhdeI7eg=="
const iv = ""
const ivGemini = ""
const password = "";

const baseImageLoad = "https://image.tmdb.org/t/p/w300_and_h450_bestv2"
const baseUrl = "https://findyourmovi.vercel.app/"
const geminiBaseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
const templateGeminiSearch = "I forget the title but can you give me one title that closest to my description: "
const maxGeminiOutputToken = 100

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

fetch('/api/env')
  .then((res) => res.json())
  .then((data) => {
     iv = data.ivKey
     ivGemini = data.ivKeyGemini
     password = data.password
  })
  .catch((err) => {
    console.log(`Error: ${err}`);
  });

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
