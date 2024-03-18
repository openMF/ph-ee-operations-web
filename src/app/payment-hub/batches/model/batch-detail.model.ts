export interface BatchDetails {
    batchId:             string;
    payerFsp:            string;
    reportGeneratedBy:   null;
    reportGeneratedAt:   Date;
    subBatchList:        SubBatchList[];
    instructionList:     any[];
    totalInstruction:    number;
    totalBatchAmount:    number;
    clientCorrelationId: string;
}

export interface SubBatchList {
    subBatchId:               string;
    batchId:                  null;
    requestId:                null;
    total:                    number;
    ongoing:                  null;
    successful:               null;
    failed:                   null;
    totalAmount:              number;
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
    payeeFspSet:              any[];
    instructionList:          null;
    budgetAccount:            null;
    generatedBy:              null;
    generatedAt:              null;
    totalInstructionCount:    null;
}

export interface BatchDetail {
    batchId:                  string;
    requestId:                null | string;
    total:                    number;
    ongoing:                  number;
    successful:               number;
    failed:                   number;
    totalAmount:              number;
    pendingAmount:            number;
    successfulAmount:         number;
    failedAmount:             number;
    file:                     string;
    notes:                    null;
    createdAt:                string;
    status:                   null;
    modes:                    null | string;
    purpose:                  null;
    failedPercentage:         string;
    successPercentage:        string;
    payerFsp:                 null | string;
    payeeFsp?:                null;
    generatedBy:              null;
    generatedAt:              Date | null;
    totalSubBatches?:         number;
    approvedTransactionCount: number;
    approvedAmount:           number;
    subBatchSummaryList?:     BatchDetail[];
    totalInstructionCount:    number | null;
    subBatchId?:              string;
    payeeFspSet?:             any[];
    instructionList?:         null;
    budgetAccount?:           null;
}
