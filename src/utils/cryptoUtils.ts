import CryptoJS from "crypto-js";
declare module 'crypto-js'; // Declare module to provide basic typing for crypto-js

/**
 * Crypto utilities for API data encryption/decryption
 * Compatible with Node.js backend crypto implementation
 */
const secretEncryption: string = import.meta.env.VITE_SECRET_KEY_EN;

class CryptoUtils {
  private secretKey: string;
  private algorithm: string;
  private mode: typeof CryptoJS.mode.CBC;
  private padding: typeof CryptoJS.pad.Pkcs7;

  constructor() {
    // Use the same secret key from your environment
    this.secretKey = secretEncryption;
    this.algorithm = "AES";
    this.mode = CryptoJS.mode.CBC;
    this.padding = CryptoJS.pad.Pkcs7;
  }

  /**
   * Generate a random IV for each encryption (16 bytes)
   */
  generateIV(): CryptoJS.lib.WordArray {
    return CryptoJS.lib.WordArray.random(16);
  }

  /**
   * Create a key hash consistent with backend (SHA256)
   */
  getKey(): CryptoJS.lib.WordArray {
    return CryptoJS.SHA256(this.secretKey);
  }

  /**
   * Encrypt data using AES-256-CBC encryption
   * @param {unknown} data - Data to encrypt (will be JSON stringified)
   * @returns {string} - Base64 encoded encrypted data with IV
   */
  encrypt(data: unknown): string {
    try {
      const jsonString = JSON.stringify(data);
      const iv = this.generateIV();
      const key = this.getKey();

      const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
        iv: iv,
        mode: this.mode,
        padding: this.padding,
      });

      // Get the ciphertext as bytes
      const cipherBytes = encrypted.ciphertext;

      // Combine IV (16 bytes) + ciphertext bytes
      const ivBytes = CryptoJS.lib.WordArray.create(iv.words);
      const combined = ivBytes.concat(cipherBytes);

      const result = CryptoJS.enc.Base64.stringify(combined);
      return result;
    } catch (error: unknown) {
      console.error("Client encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  /**
   * Decrypt data using AES-256-CBC decryption
   * @param {string} encryptedData - Base64 encoded encrypted data
   * @returns {unknown} - Decrypted and parsed data
   */
  decrypt(encryptedData: string): unknown {
    try {
      const key = this.getKey();

      // Convert from Base64 to WordArray
      const combined = CryptoJS.enc.Base64.parse(encryptedData);

      // Extract IV (first 16 bytes = 4 words in CryptoJS)
      const ivWords = combined.words.slice(0, 4);
      const iv = CryptoJS.lib.WordArray.create(ivWords, 16);

      // Extract ciphertext (remaining bytes)
      const ciphertextWords = combined.words.slice(4);
      const ciphertextLength = combined.sigBytes - 16;
      const ciphertext = CryptoJS.lib.WordArray.create(
        ciphertextWords,
        ciphertextLength
      );

      // Create cipher params object
      const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertext,
      });

      // Decrypt
      const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {
        iv: iv,
        mode: this.mode,
        padding: this.padding,
      });

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

      if (!decryptedString) {
        throw new Error("Decryption resulted in empty string");
      }

      return JSON.parse(decryptedString);
    } catch (error: unknown) {
      console.error("Client decryption error:", error);
      console.error("Failed to decrypt data:", encryptedData.substring(0, 100));
      if (error instanceof Error) {
        throw new Error("Failed to decrypt data: " + error.message);
      } else {
        throw new Error("Failed to decrypt data: An unknown error occurred.");
      }
    }
  }

  /**
   * Check if a string is valid JSON
   * @param {string} str - String to check
   * @returns {boolean} - True if valid JSON
   */
  isValidJSON(str: string): boolean {
    try {
      JSON.parse(str);
      return true;
    } catch (e: unknown) {
      return false;
    }
  }

  /**
   * Check if data should be encrypted (based on content type and size)
   * @param {unknown} data - Data to check
   * @param {string} contentType - Content type of the data
   * @returns {boolean} - True if data should be encrypted
   */
  shouldEncrypt(data: unknown, contentType: string = "application/json"): boolean {
    // Don't encrypt if not JSON content type
    if (!contentType.includes("application/json")) {
      return false;
    }

    // Don't encrypt if data is null, undefined, or empty
    if (!data || (typeof data === "object" && Object.keys(data as object).length === 0)) {
      return false;
    }

    // Don't encrypt very large payloads (optional safety check)
    const dataSize = JSON.stringify(data).length;
    if (dataSize > 1024 * 1024) {
      // 1MB limit
      console.warn("Data too large for encryption, skipping");
      return false;
    }

    return true;
  }

  /**
   * Test encryption/decryption compatibility
   * @param {object} testData - Data to test with
   */
  testCompatibility(testData: object = { test: "data", number: 123 }): boolean {
    try {
      const encrypted = this.encrypt(testData);

      const decrypted = this.decrypt(encrypted);

      const isMatch = JSON.stringify(testData) === JSON.stringify(decrypted);

      return isMatch;
    } catch (error: unknown) {
      console.error("Compatibility test failed:", error);
      return false;
    }
  }
}

// Create and export a singleton instance
const cryptoUtils = new CryptoUtils();

// Run compatibility test on load (only in development)
if (import.meta.env.DEV) {
  cryptoUtils.testCompatibility();
}

export default cryptoUtils;
