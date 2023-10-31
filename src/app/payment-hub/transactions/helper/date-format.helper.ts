export function formatDate(date: Date): string {
    return formatLocalDate(date);
}

export function formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export function dateTimeFormatValidator() {
    return (control: { value: string; }) => {
      const valid = /20\d{2}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(control.value);
      return valid ? null : { invalidDateTimeFormat: true };
    };
}