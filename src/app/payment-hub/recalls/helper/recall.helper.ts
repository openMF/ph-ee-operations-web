import { OptionData } from "app/shared/models/general.models";

export const transactionStatusData: OptionData[] = [
    {
        option: 'Completed',
        value: 'COMPLETED',
        css: 'green'
    },
    {
        option: 'Failed',
        value: 'FAILED',
        css: 'red'
    },
    {
        option: 'In progress',
        value: 'IN_PROGRESS',
        css: 'orange'
    },
    {
        option: 'Exception',
        value: 'EXCEPTION',
        css: 'red'
    }
];

export const incomingRecallStatusData: OptionData[] = [
    {option: 'Waiting for decision', value: 'WAITING_FOR_DECISION', css: 'blue'},
    {option: 'Failed recall', value: 'FAILED_RECALL', css: 'red'},
    {option: 'Exception', value: 'EXCEPTION', css: 'black'},
    {option: 'Successful accepted', value: 'SUCCESSFUL_ACCEPTED', css: 'green'},
    {option: 'Successful rejected', value: 'SUCCESSFUL_REJECTED', css: 'orange'},
    {option: 'In progress rejected', value: 'IN_PROGRESS_REJECTED', css: 'yellow'},
    {option: 'In progress accepted', value: 'IN_PROGRESS_ACCEPTED', css: 'green'},
];

export const outgoingRecallStatusData: OptionData[] = [
    {option: 'In progress', value: 'IN_PROGRESS', css: 'blue'},
    {option: 'Waiting for response', value: 'WAITING_FOR_RESPONSE', css: 'yellow'},
    {option: 'Failed recall', value: 'FAILED_RECALL', css: 'red'},
    {option: 'Response received', value: 'RESPONSE_RECEIVED', css: 'green'},
    {option: 'Exception', value: 'EXCEPTION', css: 'black'},
    {option: 'Timeout', value: 'TIMEOUT', css: 'black'},
    {option: 'Successful accepted', value: 'SUCCESSFUL_ACCEPTED', css: 'green'},
    {option: 'Successful recejted', value: 'SUCCESSFUL_REJECTED', css: 'orange'},
];

export const recallDirectionData: OptionData[] = [
    {
        option: 'AFR incoming recall',
        value: 'HCT_INST.incoming.recall',
        css: 'black'
    },
    {
        option: 'AFR outgoing recall',
        value: 'HCT_INST.outgoing.recall',
        css: 'black'
    },
    {
        option: 'IG2 incoming recall',
        value: 'IG2.incoming.recall',
        css: 'black'
    },
    {
        option: 'IG2 outgoing recall',
        value: 'IG2.outgoing.recall',
        css: 'black'
    }
];

export const businessProcessStatusData: OptionData[] = [
    {option: 'Received', value: 'RECEIVED', css: 'green'},
    {option: 'Successful transfer', value: 'SUCCESSFUL_TRANSFER', css: 'green'},
    {option: 'In progress', value: 'IN_PROGRESS', css: 'green'},
    {option: 'Suspended', value: 'SUSPENDED', css: 'green'},
    {option: 'Waiting for Fincrime decision', value: 'WAITING_FOR_FINCRIME_DECISION', css: 'green'}
];

export const paymentSchemeData: OptionData[] = [
    {option: 'HCT_INST:RECALL', value: 'HCT_INST:RECALL', css: 'green'},
    {option: 'IG2:RECALL', value: 'IG2:RECALL', css: 'green'}
];
