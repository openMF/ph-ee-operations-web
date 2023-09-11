import { Paging } from './paging.model';

/** Payment HUB Recall model. */
export interface Recall {
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

export interface Recalls extends Paging {
  content: Recall[];
}
