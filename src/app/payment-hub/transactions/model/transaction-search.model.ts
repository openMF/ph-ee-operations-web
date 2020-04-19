/** Payment HUB - Transaction Search model. */
export interface TransactionSearch {
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
}
