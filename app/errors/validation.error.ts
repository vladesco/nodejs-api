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
        return `[Validation]: ${this.message}`;
    }
}

export class NotFoundError extends BaseHttpError {
    get errorCode() {
        return HttpStatusCode.NOT_FOUND;
    }
    public getMessage(): string {
        return `[Not Found]: ${this.message}`;
    }
}

export class ForbiddenError extends BaseHttpError {
    get errorCode() {
        return HttpStatusCode.FORBIDDEN;
    }

    public getMessage(): string {
        return `[Forbidden]: ${this.message}`;
    }
}

export class AuthorizationError extends BaseHttpError {
    get errorCode() {
        return HttpStatusCode.UNAUTHORIZED;
    }

    public getMessage(): string {
        return `[Authorization]: ${this.message}`;
    }
}
