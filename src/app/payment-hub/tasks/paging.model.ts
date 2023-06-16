export interface Paging {
    pageable: Pageable;
    last: boolean;
    totalPages: number;
    totalElements: number;
    number: number;
    sort: Sort;
    size: number;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

export interface Pageable {
    sort: Sort;
    offset: boolean;
    pageNumber: boolean;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Sort {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}
