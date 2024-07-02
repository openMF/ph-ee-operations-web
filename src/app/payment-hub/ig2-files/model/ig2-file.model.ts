import { Paging } from './paging.model';

/** Payment HUB Ig2 File model. */
export interface Ig2File {
  id: number;
  workflowInstanceKey: number;
  transactionId: string;
  startedAt: string;
  completedAt: string;
  status: string;
  recallStatus: string;
  payeeDfspId: string;
  payeePartyId: string;
  payeePartyIdType: string;
  payeeFee: number;
  payeeFeeCurrency: string;
  payeeQuoteCode: string;
  payerDfspId: string;
  payerPartyId: string;
  payerPartyIdType: string;
  payerFee: number;
  payerFeeCurrency: number;
  payerQuoteCode: string;
  amount: number;
  currency: string;
}

export interface Ig2Files extends Paging {
  content: Ig2File[];
}
