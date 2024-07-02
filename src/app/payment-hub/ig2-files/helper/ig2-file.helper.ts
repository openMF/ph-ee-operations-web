import { CodeName, OptionData } from "app/shared/models/general.models";

export const ig2FileStatusData: OptionData[] = [
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