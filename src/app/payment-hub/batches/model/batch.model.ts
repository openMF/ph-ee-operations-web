export interface Batch {
    totalBatches: number;
    totalTransactions: number;
    totalAmount: number;
    totalApprovedCount: number;
    totalApprovedAmount: number;
    totalSubBatchesCreated: number;
    data: BatchData[];
}

export interface BatchData {
    id: number;
    batchId: string;
    subBatchId: string | null;
    requestId: string;
    requestFile: string;
    totalTransactions: number;
    ongoing: number;
    failed: number;
    completed: number;
    totalAmount: number | null;
    ongoingAmount: null;
    failedAmount: null;
    completedAmount: null;
    result_file: string;
    resultGeneratedAt: string;
    note: string;
    workflowKey: string | null;
    workflowInstanceKey: string;
    startedAt: string;
    completedAt: string | null;
    paymentMode: string | null;
    registeringInstitutionId: string;
    payerFsp: string | null;
    correlationId: string;
    approvedAmount: string | null;
    approvedCount: string | null;
}

export interface BatchInstruction {
    requestId: string;
    creditParty: BatchParty[];
    debitParty?: BatchParty[] | null;
    paymentMode: string;
    currency: string;
    amount: number;
    subType?: string | null;
    descriptionText: string | null;
}

export interface BatchParty {
    key: string;
    value: string;
}
