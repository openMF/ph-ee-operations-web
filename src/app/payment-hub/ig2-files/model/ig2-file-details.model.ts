import { Ig2File } from './ig2-file.model';

/** Payment HUB - Ig2 File detail model. */
export interface Ig2FileDetails {
  recall: Ig2File;
  tasks: Task[];
  variables: Ig2FileEntry[];
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

export interface Ig2FileEntry {
  id: number;
  workflowKey: number;
  workflowInstanceKey: number;
  timestamp: number;
  name: string;
  value: string;
}
