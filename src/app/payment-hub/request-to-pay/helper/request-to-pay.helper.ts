import { OptionData } from "app/shared/models/general.models";

export const requestToPayStatesData: OptionData[] = [
    {
        option: 'Accepted',
        value: 'ACCEPTED',
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