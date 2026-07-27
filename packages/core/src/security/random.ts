import { randomBytes, randomInt } from 'crypto';

export function generateRandomString(bytes: number = 32): string {
    return randomBytes(bytes).toString('hex');
}

export function generateRandomNumericCode(length: number = 6): string {
    let code = '';
    for (let i = 0; i < length; i++) {
        code += randomInt(0, 10).toString();
    }
    return code;
}
