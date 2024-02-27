import { Pageable, Sort } from 'app/shared/models/data.model';

export interface AccountData {
    content:          Account[];
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

export interface Account {
    registeringInstitutionId: string;
    payeeIdentity:            string;
    paymentModality:          string;
    financialAddress:         string;
    bankingInstitutionCode:   string;
}

