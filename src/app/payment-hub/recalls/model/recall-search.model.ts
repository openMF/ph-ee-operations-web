/** Payment HUB - Recall Search model. */
export interface RecallSearch {
  payeeMSISDN: number;
  payerMSDISDN: number;
  transactionId: string;
  status: number;
  amount: number;
  currency: string;
  timeFrom: string;
  timeTo: string;
  dateFormat: string;
  locale: string;
  endToEndIdentification: string;
}
