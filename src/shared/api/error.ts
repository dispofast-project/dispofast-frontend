import type { ApiError } from "../types/common";

export const isApiError = (error: unknown) : error is ApiError => {
    return (typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as ApiError).response === 'object' && 
        (error as ApiError).response !== null
    );
}