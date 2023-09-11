import { Recall } from './recall.model';

/** Payment HUB - Recall detail model. */
export interface RecallDetails {
  recall: Recall;
  tasks: Task[];
  variables: RecallEntry[];
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

export interface RecallEntry {
  id: number;
  workflowKey: number;
  workflowInstanceKey: number;
  timestamp: number;
  name: string;
  value: string;
}
