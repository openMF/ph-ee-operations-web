import { Pageable, Sort } from 'app/shared/models/data.model';

export interface VoucherData {
    content:          Voucher[];
    pageable:         Pageable;
    totalPages:       number;
    totalElements:    number;
    last:             boolean;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    first:            boolean;
    empty:            boolean;
}

export interface Voucher {
    serialNumber:             string;
    createdDate:              Date;
    registeringInstitutionId: string;
    status:                   string;
}

export interface Status {
    code: string;
    label: string;
}

export interface VoucherInstruction {
    instructionID: string;
    groupCode: string;
    currency: string;
    amount: number;
    expiry?: string | null;
    payeeFunctionalID: string;
    narration?: string | null;
}
