import { AppError } from './AppError';

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', details: any = null) {
        super(message, 404, 'NOT_FOUND_ERROR', details);
    }
}
