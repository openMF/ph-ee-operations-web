export const transactionStatusData = [
    {
        option: 'ACCEPTED',
        value: 'ACCEPTED',
        css: 'green'
    },
    {
        option: 'FAILED',
        value: 'FAILED',
        css: 'red'
    },
    {
        option: 'IN PROGRESS',
        value: 'IN_PROGRESS',
        css: 'orange'
    },
    {
        option: '',
        value: 'UNKNOWN',
        hidden: true
    }
];

export const paymentStatusData = [
    {option: 'Received', value: 'RECEIVED', css: 'green'},
    {option: 'Successful transfer', value: 'SUCCESSFUL_TRANSFER', css: 'green'},
    {option: 'In progress', value: 'IN_PROGRESS', css: 'green'},
    {option: 'Suspended', value: 'SUSPENDED', css: 'green'},
    {option: 'Waiting for Fincrime decision', value: 'WAITING_FOR_FINCRIME_DECISION', css: 'green'}
];
