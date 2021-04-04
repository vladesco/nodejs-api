import { HttpStatusCode } from './types';

export abstract class BaseHttpError extends Error {
    abstract get errorCode(): number;
    abstract getMessage(): string;
}

export class ValidationError extends BaseHttpError {
    get errorCode() {
        return HttpStatusCode.BAD_REQUEST;
    }

    public getMessage(): string {
        return `[validation error]: ${this.message}`;
    }
}

export class NotFoundError extends BaseHttpError {
    get errorCode() {
        return HttpStatusCode.NOT_FOUND;
    }
    public getMessage(): string {
        return `[No Found Error error]: ${this.message}`;
    }
}
