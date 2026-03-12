export interface ApiError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      [key: string]: unknown;
    };
  };
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  pageable: Pageable;
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

export interface Department {
  code: string;
  name: string;
}

export interface Location {
  code: string;
  name: string;
  department: Department;
}
