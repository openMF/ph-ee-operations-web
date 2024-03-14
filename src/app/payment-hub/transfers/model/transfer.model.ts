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

export interface SubBatchDetail {
    subBatchId:               string;
    batchId:                  string;
    requestId:                null;
    total:                    null;
    ongoing:                  null;
    successful:               null;
    failed:                   null;
    totalAmount:              null;
    pendingAmount:            null;
    successfulAmount:         null;
    failedAmount:             null;
    file:                     null;
    notes:                    null;
    createdAt:                null;
    status:                   null;
    modes:                    null;
    purpose:                  null;
    failedPercentage:         null;
    successPercentage:        null;
    payerFsp:                 null;
    approvedAmount:           null;
    approvedTransactionCount: null;
    payeeFspSet:              null;
    instructionList:          InstructionList[];
    budgetAccount:            null;
    generatedBy:              null;
    generatedAt:              Date;
    totalInstructionCount:    number;
}

export interface InstructionList {
    instructionId:     string;
    payerFsp:          null | string;
    payeeFunctionalId: PayeeFunctionalID;
    amount:            number;
    status:            Status;
    reason:            null;
    startedAt:         number;
    completedAt:       number;
    subBatchId:        null;
}

export enum PayeeFunctionalID {
    Accountnumber = "accountnumber",
}

export enum Status {
    Completed = "COMPLETED",
    InProgress = "IN_PROGRESS",
}