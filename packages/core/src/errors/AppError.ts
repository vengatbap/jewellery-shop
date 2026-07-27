export class AppError extends Error {
    public readonly statusCode: number;
    public readonly errorCode: string;
    public readonly details: any;

    constructor(message: string, statusCode: number = 500, errorCode: string = 'INTERNAL_SERVER_ERROR', details: any = null) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.details = details;
        Object.setPrototypeOf(this, new.target.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
