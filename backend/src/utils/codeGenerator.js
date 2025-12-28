import { customAlphabet } from 'nanoid';

// Generate codes like: ABC123, XYZ789
const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

export function generateCode() {
  return nanoid();
}
