import { RequestPay } from './requestPay.model';

/** Payment HUB - Transaction detail model. */
export interface RequestPayDetails {
  requestPay: RequestPay;
  tasks: Task[];
  variables: RequestPayEntry[];
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

export interface RequestPayEntry {
  id: number;
  workflowKey: number;
  workflowInstanceKey: number;
  timestamp: number;
  name: string;
  value: string;
}
