export type Status = "success" | "error" | "pending";
export type Meta = { pagination?: unknown; requestId?: string; [k: string]: unknown };

export interface ApiResponseData<T> {
    status: Status,
    message?: string;
    data?: T;
    error?: {
        message: string;
        code: number;
        details?: unknown
        stack?: string;
    }
    meta?: Meta | undefined;
}
