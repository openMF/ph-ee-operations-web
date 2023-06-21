import { Paging } from './paging.model';

/** Payment HUB Transaction model. */
export interface ZeebeTask {
  id: number;
  businessKey: string;
  name: string;
  description: string;
  assignee: string;
  candidateRoles: string[];
  taskForm: string;
  previousSubmitters: string[];
  formData: string;
  assignable: boolean;
  notAssignableReason: string[];
}

export interface ZeebeTasks extends Paging {
  content: ZeebeTask[];
}
