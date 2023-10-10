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
    ongoingAmount: null,
    failedAmount: null,
    completedAmount: null,
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