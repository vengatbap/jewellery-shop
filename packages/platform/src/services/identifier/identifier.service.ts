import { IdentifierType, IdentifierOptions } from './identifier.types';

export function generateBusinessIdentifier(type: IdentifierType, options: IdentifierOptions): string {
    const { counter, year } = options;
    const cleanCounter = Math.max(1, Math.floor(counter));
    
    switch (type) {
        case 'ORGANIZATION':
            // ORG000001
            return `ORG${String(cleanCounter).padStart(6, '0')}`;
        case 'BRANCH':
            // BR001
            return `BR${String(cleanCounter).padStart(3, '0')}`;
        case 'CUSTOMER':
            // CUS000001
            return `CUS${String(cleanCounter).padStart(6, '0')}`;
        case 'INVOICE': {
            // INV2026000001
            const currentYear = year || new Date().getFullYear();
            return `INV${currentYear}${String(cleanCounter).padStart(6, '0')}`;
        }
        case 'JOB_REPAIR':
            // JR0000001
            return `JR${String(cleanCounter).padStart(7, '0')}`;
        default:
            throw new Error(`Unsupported identifier type: ${type}`);
    }
}
