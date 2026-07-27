import bcrypt from 'bcryptjs';

export async function hashString(value: string, saltRounds: number = 10): Promise<string> {
    return bcrypt.hash(value, saltRounds);
}

export async function compareHash(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
}
