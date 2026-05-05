// lib/errors.ts
export class AppError extends Error {
    status: number;
    constructor(message: string, status = 400) {
        super(message);
        this.status = status;
        this.name = "AppError";
    }
}


export class ExternalServiceError extends AppError {
    constructor(message: string, status = 502) {
        super(message, status);           // 502 Bad Gateway por defecto
        this.name = "ExternalServiceError";
    }
}
