import { CodeName, OptionData } from "app/shared/models/general.models";

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

export const incomingbusinessProcessStatusData: OptionData[] = [
    {option: 'Received', value: 'RECEIVED', css: 'green'},
    {option: 'Successful transfer', value: 'SUCCESSFUL_TRANSFER', css: 'green'},
    {option: 'Transfer to disposal', value: 'TRANSFER_TO_DISPOSAL', css: 'green'},
    {option: 'Exception', value: 'EXCEPTION', css: 'black'},
    {option: 'Manual decision', value: 'MANUAL_DECISION', css: 'orange'},
    {option: 'In progress', value: 'IN_PROGRESS', css: 'blue'},
    {option: 'Unsuccessful transfer', value: 'UNSUCCESSFUL_TRANSFER', css: 'red'}
];

export const outgoingbusinessProcessStatusData: OptionData[] = [
    {option: 'Successful transfer', value: 'SUCCESSFUL_TRANSFER', css: 'green'},
    {option: 'Exception', value: 'EXCEPTION', css: 'black'},
    {option: 'In progress', value: 'IN_PROGRESS', css: 'blue'},
    {option: 'Transfer to conversion', value: 'TRANSFER_TO_CONVERSION', css: 'yellow'},
    {option: 'Cancelled transfer', value: 'CANCELLED_TRANSFER', css: 'red'},
    {option: 'Unsuccessful transfer', value: 'UNSUCCESSFUL_TRANSFER', css: 'red'},
    {option: 'Investigation', value: 'INVESTIGATION', css: 'orange'}
];

export const paymentSchemeData: OptionData[] = [
    {option: 'HCT_INST', value: 'HCT_INST', css: 'green'},
    {option: 'IG2', value: 'IG2', css: 'green'},
    {option: 'ON_US', value: 'ON_US', css: 'green'},
    {option: 'IG2:RETURN', value: 'IG2:RETURN', css: 'green'}
];

export const recallReasonData: CodeName[] = [ 
    {code: 'DUPL', name: 'DUPL', filter:['HCT_INST', 'IG2', 'IG2:RETURN']},
    {code: 'CUST', name: 'CUST', filter:['HCT_INST']},
    {code: 'FRAD', name: 'FRAD', filter:['HCT_INST', 'IG2', 'IG2:RETURN']},
    {code: 'TECH', name: 'TECH', filter:['HCT_INST', 'IG2', 'IG2:RETURN']},
    {code: 'AM09', name: 'AM09', filter:['HCT_INST']},
    {code: 'AC03', name: 'AC03', filter:['HCT_INST']}
];