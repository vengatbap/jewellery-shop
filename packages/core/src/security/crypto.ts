import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-cbc';

export function encryptString(value: string, keyHex: string): string {
    const iv = randomBytes(16);
    const key = Buffer.from(keyHex, 'hex');
    const cipher = createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(value, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptString(encryptedValue: string, keyHex: string): string {
    const [ivHex, encryptedText] = encryptedValue.split(':');
    if (!ivHex || !encryptedText) {
        throw new Error('Invalid encrypted value format');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const key = Buffer.from(keyHex, 'hex');
    const decipher = createDecipheriv(ALGORITHM, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
