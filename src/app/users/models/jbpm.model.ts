export interface ProcessInstance {
    'process-instance-id': number;
    'process-id': string;
    'process-name': string;
    'process-version': string;
    'process-instance-state': number;
    'container-id': string;
    initiator: string;
    'start-date': {
      'java.util.Date': number;
    };
    'process-instance-desc': string;
    'correlation-key': string;
    'parent-instance-id': number;
    'sla-compliance': number;
    'sla-due-date': null;
    'active-user-tasks': {
      'task-summary': TaskSummary[];
    };
    'process-instance-variables': null;
  }
  
export interface TaskSummary {
    'task-id': number;
    'task-name': string;
    'task-subject': string;
    'task-description': string;
    'task-status': string;
    'task-priority': number;
    'task-is-skipable': null;
    'task-actual-owner': string;
    'task-created-by': string;
    'task-created-on': {
      'java.util.Date': number;
    };
    'task-activation-time': {
      'java.util.Date': number;
    };
    'task-expiration-time': null;
    'task-proc-inst-id': number;
    'task-proc-def-id': string;
    'task-container-id': string;
    'task-parent-id': null;
  }