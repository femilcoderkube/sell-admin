// The 'crypto-js' import is not used in this Web Crypto implementation and can be removed.
// import cryptoJs from 'crypto-js'; 
 
// Use a 32-byte key. Recommended: base64 from your build env (VITE_E2E_AES_KEY)
const base64Key: string | undefined = import.meta.env.VITE_E2E_AES_KEY; // 32-byte key in base64
 
async function importKey(): Promise<CryptoKey> {
  if (!base64Key) throw new Error('Missing VITE_E2E_AES_KEY');
  const raw: Uint8Array = Uint8Array.from(atob(base64Key), c => c.charCodeAt(0));
  if (raw.length !== 32) throw new Error('VITE_E2E_AES_KEY must be 32 bytes (base64)');
  return await crypto.subtle.importKey(
    'raw',
    // Convert to a true ArrayBuffer to satisfy BufferSource typing across TS lib versions
    toArrayBuffer(raw),
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}
 
export async function encryptJsonAesGcm(obj: unknown): Promise<{ ciphertext: string; iv: string; tag: string; }> {
  const key: CryptoKey = await importKey();
  const iv: Uint8Array = crypto.getRandomValues(new Uint8Array(12));
  const plaintext: Uint8Array = new TextEncoder().encode(JSON.stringify(obj));
  const ciphertextBuf: ArrayBuffer = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: toArrayBuffer(iv) }, key, toArrayBuffer(plaintext));
  const ciphertext: string = btoa(String.fromCharCode(...new Uint8Array(ciphertextBuf)));
  const ivB64: string = btoa(String.fromCharCode(...iv));
  // WebCrypto stores the auth tag inside ciphertext (browser AES-GCM does this)
  // Our server expects tag separate, so we’ll split last 16 bytes as tag:
  const ctBytes: Uint8Array = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const tag: Uint8Array = ctBytes.slice(ctBytes.length - 16);
  const body: Uint8Array = ctBytes.slice(0, ctBytes.length - 16);
  return {
    ciphertext: btoa(String.fromCharCode(...body)),
    iv: ivB64,
    tag: btoa(String.fromCharCode(...tag)),
  };
}
 
interface DecryptedPayload {
  ciphertext: string;
  iv: string;
  tag: string;
}
 
export async function decryptJsonAesGcm({ ciphertext, iv, tag }: DecryptedPayload): Promise<unknown> {
  const key: CryptoKey = await importKey();
  const body: Uint8Array = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
  const ivBuf: Uint8Array = Uint8Array.from(atob(iv), c => c.charCodeAt(0));
  const tagBuf: Uint8Array = Uint8Array.from(atob(tag), c => c.charCodeAt(0));
  // Re-attach tag to tail of ciphertext (WebCrypto expects combined)
  const combined: Uint8Array = new Uint8Array(body.length + tagBuf.length);
  combined.set(body, 0);
  combined.set(tagBuf, body.length);
  const plaintextBuf: ArrayBuffer = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: toArrayBuffer(ivBuf) }, key, toArrayBuffer(combined));
  const text: string = new TextDecoder().decode(plaintextBuf);
  return JSON.parse(text);
}

// Ensures we pass a true ArrayBuffer (not just ArrayBufferLike) to Web Crypto
function toArrayBuffer(view: Uint8Array): ArrayBuffer {
  const buf = view.buffer;
  if (buf instanceof ArrayBuffer && view.byteOffset === 0 && view.byteLength === buf.byteLength) {
    return buf;
  }
  // Create a copy backed by a fresh ArrayBuffer
  return view.slice().buffer;
}