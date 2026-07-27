import { getStorageProvider } from '@auric-one/storage';

export type FileEntityType =
    | 'ORGANIZATION_LOGO'
    | 'USER_AVATAR'
    | 'PRODUCT_IMAGE'
    | 'BARCODE_LABEL'
    | 'INVOICE'
    | 'REPORT'
    | 'DOCUMENT';

export class FileService {
    static async upload(
        entityType: FileEntityType,
        entityId: string,
        file: Buffer,
        contentType?: string
    ): Promise<string> {
        const bucket = entityType.toLowerCase().replace('_', '-');
        const key = `${entityId}/${Date.now()}`;
        
        console.log(`🗄️ [Platform/FileService] Routing upload for ${entityType} ID: ${entityId}`);
        const provider = getStorageProvider();
        return provider.upload(bucket, key, file, contentType);
    }
}
