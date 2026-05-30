export class ApiError extends Error {
    public code: number;
    public data: unknown;
    public errors: unknown[];

    constructor(
        code: number,
        message = "Something went wrong!",
        errors: unknown[] = [],
        stack=""
    ) {
        super(message);
        this.code = code;
        this.data = null;
        this.message = message;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else if (process.env.NODE_ENV === 'development') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}