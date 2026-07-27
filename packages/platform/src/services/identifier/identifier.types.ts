export type IdentifierType =
    | 'ORGANIZATION'
    | 'BRANCH'
    | 'CUSTOMER'
    | 'INVOICE'
    | 'JOB_REPAIR';

export interface IdentifierOptions {
    counter: number;
    year?: number;
}
