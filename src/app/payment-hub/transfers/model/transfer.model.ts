import { Pageable, Sort } from "app/shared/models/data.model";

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
    completedAt:         null;
    status:              string;
    statusDetail:        null;
    payeeDfspId:         null;
    payeePartyId:        null;
    payeePartyIdType:    null;
    payeeFee:            null;
    payeeFeeCurrency:    null;
    payeeQuoteCode:      null;
    payerDfspId:         null;
    payerPartyId:        null;
    payerPartyIdType:    null;
    payerFee:            null;
    payerFeeCurrency:    null;
    payerQuoteCode:      null;
    amount:              null;
    currency:            null;
    direction:           string;
    errorInformation:    null;
    batchId:             null;
    clientCorrelationId: string;
}
