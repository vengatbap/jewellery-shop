import { config } from '@auric-one/config';

export interface StorageProvider {
    upload(bucket: string, key: string, file: Buffer, contentType?: string): Promise<string>;
    download(bucket: string, key: string): Promise<Buffer>;
    delete(bucket: string, key: string): Promise<void>;
}

export class LocalStorageProvider implements StorageProvider {
    async upload(bucket: string, key: string, file: Buffer, _contentType?: string): Promise<string> {
        console.log(`💾 [LocalStorage] Uploading file to ${bucket}/${key} (${file.length} bytes)`);
        return `local://${bucket}/${key}`;
    }

    async download(bucket: string, key: string): Promise<Buffer> {
        console.log(`💾 [LocalStorage] Downloading file from ${bucket}/${key}`);
        return Buffer.from('');
    }

    async delete(bucket: string, key: string): Promise<void> {
        console.log(`💾 [LocalStorage] Deleting file from ${bucket}/${key}`);
    }
}

export class MinioStorageProvider implements StorageProvider {
    async upload(bucket: string, key: string, file: Buffer, _contentType?: string): Promise<string> {
        console.log(`🪣 [MinioStorage] Uploading file to ${bucket}/${key} (${file.length} bytes)`);
        return `minio://${bucket}/${key}`;
    }

    async download(bucket: string, key: string): Promise<Buffer> {
        console.log(`🪣 [MinioStorage] Downloading file from ${bucket}/${key}`);
        return Buffer.from('');
    }

    async delete(bucket: string, key: string): Promise<void> {
        console.log(`🪣 [MinioStorage] Deleting file from ${bucket}/${key}`);
    }
}

export function getStorageProvider(): StorageProvider {
    const type = config.storage?.type || 'local';
    if (type === 's3') {
        return new MinioStorageProvider();
    }
    return new LocalStorageProvider();
}
