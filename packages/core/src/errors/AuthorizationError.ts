import { AppError } from './AppError';

export class AuthorizationError extends AppError {
    constructor(message: string = 'Access denied', details: any = null) {
        super(message, 403, 'AUTHORIZATION_ERROR', details);
    }
}
