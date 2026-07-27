import { AppError } from './AppError';

export class ConflictError extends AppError {
    constructor(message: string = 'Conflict detected', details: any = null) {
        super(message, 409, 'CONFLICT_ERROR', details);
    }
}
