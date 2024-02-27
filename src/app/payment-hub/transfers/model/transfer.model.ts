import { Pageable, Sort } from 'app/shared/models/data.model';

export interface TransferData {
    content:          Transfer[];
    pageable:         Pageable;
    totalPages:       number;
    last:             boolean;
    totalElements:    number;
    first:            boolean;
    size:             number;
    number:           number;
    sort:             Sort;
    numberOfElements: number;
    empty:            boolean;
}

export interface Transfer {
    id:                  number;
    workflowInstanceKey: number;
    transactionId:       string;
    startedAt:           number;
    completedAt:         number;
    status:              string;
    statusDetail:        string;
    payeeDfspId:         string;
    payeePartyId:        string;
    payeePartyIdType:    string;
    payeeFee:            number;
    payeeFeeCurrency:    string;
    payeeQuoteCode:      string;
    payerDfspId:         string;
    payerPartyId:        string;
    payerPartyIdType:    string;
    payerFee:            number;
    payerFeeCurrency:    string;
    payerQuoteCode:      string;
    amount:              number;
    currency:            string;
    direction:           string;
    errorInformation:    string;
    batchId:             string;
    clientCorrelationId: string;
}
