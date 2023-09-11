export function formatDate(date: Date): string {
    return formatLocalDate(date);
}

export function formatLocalDate(date: Date): string {
    let options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return date.toLocaleString('default', options);
}
