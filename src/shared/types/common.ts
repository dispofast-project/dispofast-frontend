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

export interface PagedResponse<T> {
  content: T[];
  pageable: PageableDTO;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Sort;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export type PagedResponseDTO<T> = PagedResponse<T>;

export interface Department {
  code: string;
  name: string;
}

export interface Location {
  code: string;
  name: string;
  department: Department;
}
