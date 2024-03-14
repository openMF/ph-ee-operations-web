export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = '0' + (date.getMonth() + 1);
    const day = '0' + date.getDate();
    // Hours part from the timestamp
    const hours = '0' + date.getHours();
    // Minutes part from the timestamp
    const minutes = '0' + date.getMinutes();
    // Seconds part from the timestamp
    const seconds = '0' + date.getSeconds();

    // Will display time in 2020-04-10 18:04:36Z format
    return year + '-' + month.substr(-2) + '-' + day.substr(-2) + 'T' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}

export function formatUTCDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = '0' + (date.getUTCMonth() + 1);
    const day = '0' + date.getUTCDate();
    // Hours part from the timestamp
    const hours = '0' + date.getUTCHours();
    // Minutes part from the timestamp
    const minutes = '0' + date.getUTCMinutes();
    // Seconds part from the timestamp
    const seconds = '0' + date.getUTCSeconds();

    // Will display time in 2020-04-10 18:04:36Z format
    return year + '-' + month.substr(-2) + '-' + day.substr(-2) + 'T' + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
}
