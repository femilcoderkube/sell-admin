declare module 'crypto-js'; // Declare module to provide basic typing for crypto-js

import CryptoJS from "crypto-js";
import { isBuffer } from "lodash";

// Define interfaces for better type safety
interface EncryptedSocketData {
  __encrypted: boolean;
  data: string;
  iv: string;
  encoding?: "base64" | "hex";
  alg?: string;
}

// A basic interface for the socket object, focusing on the methods used
interface Socket {
  emit: (event: string, data: unknown, ...args: any[]) => void;
  on: (event: string, listener: (...args: any[]) => void) => void;
  off: (event: string, listener: (...args: any[]) => void) => void;
  // Add other properties/methods if they are accessed directly and need typing
}

const Universalsecret: string | undefined = import.meta.env.VITE_UNIVERSAL_EN_SECRET_KEY;

class UniversalSocketEncryption {
  private key: CryptoJS.lib.WordArray;

  constructor(secretKey: string | undefined = Universalsecret) {
    // Derive a 32-byte key via SHA-256 (matches backend)
    this.key = CryptoJS.SHA256(String(secretKey));
  }

  // Generate random 16-byte IV per message
  generateIV(): CryptoJS.lib.WordArray {
    return CryptoJS.lib.WordArray.random(16);
  }

  encrypt(data: unknown): EncryptedSocketData | unknown {
    try {
      const text: string =
        typeof data === "object" ? JSON.stringify(data) : String(data);
      const iv: CryptoJS.lib.WordArray = this.generateIV();

      // CryptoJS returns base64 string by default when calling toString() on ciphertext
      const encrypted: CryptoJS.lib.CipherParams = CryptoJS.AES.encrypt(text, this.key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      return {
        __encrypted: true,
        data: encrypted.toString(), // base64 ciphertext
        iv: CryptoJS.enc.Base64.stringify(iv), // base64 IV (matches backend)
        // encoding: "base64",
        // alg: this.algorithm,
      };
    } catch (error: unknown) {
      console.error("Encryption error:", error);
      return data;
    }
  }

  decrypt(encryptedData: EncryptedSocketData | unknown): unknown {
    try {
      // Check if it's an object and has the __encrypted flag
      if (
        typeof encryptedData !== "object" ||
        encryptedData === null ||
        !(encryptedData as EncryptedSocketData).__encrypted
      ) {
        return encryptedData;
      }

      const { data: encrypted, iv, encoding = "base64" } = encryptedData as EncryptedSocketData;
      if (!encrypted || !iv) return encryptedData;

      // IV is base64 per our encrypt(); convert to WordArray
      const ivWordArray: CryptoJS.lib.WordArray = CryptoJS.enc.Base64.parse(iv);

      // CryptoJS expects base64 by default; handle hex if ever sent
      const cipherTextForDecrypt: string =
        encoding === "hex"
          ? CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(encrypted))
          : encrypted;

      const decrypted: CryptoJS.lib.WordArray = CryptoJS.AES.decrypt(cipherTextForDecrypt, this.key, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      const decryptedText: string = CryptoJS.enc.Utf8.stringify(decrypted);
      if (!decryptedText) return encryptedData;

      try {
        return JSON.parse(decryptedText);
      } catch {
        return decryptedText;
      }
    } catch (error: unknown) {
      console.error("Decryption error:", error);
      return encryptedData;
    }
  }

  wrapSocket<T extends Socket>(socket: T): T {
    const originalEmit = socket.emit;
    const originalOn = socket.on;
    const originalOff = socket.off;

    socket.emit = (event: string, data: unknown, ...args: any[]): void => {
      if (
        data &&
        typeof data === "object" &&
        !isBuffer(data) &&
        !(data as EncryptedSocketData).__encrypted
      ) {
        data = this.encrypt(data);
      }
      return originalEmit.call(socket, event, data, ...args);
    };

    const wrappedListeners = new Map<(...args: any[]) => void, (...args: any[]) => void>();

    socket.on = (event: string, listener: (...args: any[]) => void): void => {
      const wrappedListener = (data: unknown, ...args: any[]): void => {
        if (data && typeof data === "object" && (data as EncryptedSocketData).__encrypted) {
          data = this.decrypt(data);
        }
        return listener(data, ...args);
      };
      wrappedListeners.set(listener, wrappedListener);
      return originalOn.call(socket, event, wrappedListener);
    };

    socket.off = (event: string, listener: (...args: any[]) => void): void => {
      if (listener && wrappedListeners.has(listener)) {
        const wrappedListener = wrappedListeners.get(listener);
        wrappedListeners.delete(listener);
        return originalOff.call(socket, event, wrappedListener as (...args: any[]) => void);
      }
      return originalOff.call(socket, event, listener);
    };

    return socket;
  }
}

export const universalSocketEncryption = new UniversalSocketEncryption();
export const wrapSocketWithEncryption = <T extends Socket>(socket: T): T =>
  universalSocketEncryption.wrapSocket(socket);
export default universalSocketEncryption;
