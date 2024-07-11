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

export function convertUtcToLocal(utcDateString: string): string {
  if (utcDateString) {
    const [datePart, timePart] = utcDateString.split('T');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hour, minute, second] = timePart.replace('Z', ' ').split(':').map(Number);
    const utcDate = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
    const localDate = new Date(utcDate.getTime() - (utcDate.getTimezoneOffset() * 60000));
    const formattedDate = localDate.toISOString().slice(0, 19).replace('T', ' ').replace('Z', ' ');
    return formattedDate;
  }
}

export function convertMomentToDateTime(moment: Moment): string {
    if (moment) {
      const isoDate = moment.toISOString().slice(0, 19);
      return `${isoDate}Z`;
    }
}

export function convertMomentToDate(moment: Moment): string {
  if (moment) {
    return moment.format('YYYY-MM-DD');
  }
}