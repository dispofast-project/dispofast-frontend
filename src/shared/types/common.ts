export interface ApiError {
    response?: {
        status?: number;
        data?: {
            message?: string;
            [key: string]: any;
        }
    }
}

export interface SortDTO {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface PageableDTO {
    pageNumber: number;
    pageSize: number;
    sort: SortDTO;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface PagedResponseDTO<T> {
    content: T[];
    pageable: PageableDTO;
    last: boolean;
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    sort: SortDTO;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
