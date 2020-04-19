import { Transaction } from './transaction.model';

/** Payment HUB - Transaction detail model. */
export interface TransactionDetails {
  transaction: Transaction;
  tasks: Task[];
  variables: TransactionEntry[];
}

export interface Task {
  id: number;
  workflowKey: number;
  workflowInstanceKey: number;
  timestamp: number;
  intent: string;
  recordType: string;
  type: string;
}

export interface TransactionEntry {
  id: number;
  workflowKey: number;
  workflowInstanceKey: number;
  timestamp: number;
  name: string;
  value: string;
}
