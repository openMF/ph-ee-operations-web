import { Moment } from 'moment';

export function formatDateForDisplay(date: string): string {
    if (!date) {
      return undefined;
    }
    date = date.toString();
    date = date.replace('+0000', '');
    date = date.replace('T', ' ');
    date = date.replace('.000', '');
    date = date.replace('Z', '');
    return date;
}

export function convertMomentToDate(moment: Moment): string {
    const year = moment.year();
    const month = (moment.month() + 1).toString().padStart(2, '0');
    const day = moment.date().toString().padStart(2, '0');
    const hours = moment.hours().toString().padStart(2, '0');
    const minutes = moment.minutes().toString().padStart(2, '0');
    const seconds = moment.seconds().toString().padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}
