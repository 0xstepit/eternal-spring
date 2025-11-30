export function toPostDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate: string = date.toLocaleDateString(undefined, options);

  return formattedDate;
}

export function getMonth(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
  };

  return date.toLocaleDateString(undefined, options);
}

export function getYear(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
  };

  return date.toLocaleDateString(undefined, options);
}

export function getDay(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
  };

  return date.toLocaleDateString(undefined, options);
}
