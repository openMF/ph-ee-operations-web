/** Payment HUB - Ig2 File Search model. */
export interface Ig2FileSearch {
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
