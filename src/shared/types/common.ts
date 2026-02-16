export interface ApiError {
    response?: {
        status?: number;
        data?: {
            message?: string;
            [key: string]: any;
        }
    }
}