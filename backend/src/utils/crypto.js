import CryptoJS from 'crypto-js';

export function encrypt(text) {
  const SECRET_KEY = process.env.ENCRYPTION_KEY;
  if (!SECRET_KEY) console.error("CRITICAL: ENCRYPTION_KEY is missing!");
  
  if (!text) return '';
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

export function decrypt(encryptedText) {
  const SECRET_KEY = process.env.ENCRYPTION_KEY;
  if (!SECRET_KEY) return '';

  if (!encryptedText) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed:", e);
    return '';
  }
}
