import { hashString, compareHash } from '@auric-one/core';

export class PasswordService {
    static async hashPassword(password: string): Promise<string> {
        return hashString(password);
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return compareHash(password, hash);
    }
}
