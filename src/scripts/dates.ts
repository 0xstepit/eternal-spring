export function toPostDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate: string = date.toLocaleDateString(undefined, options);

  return formattedDate;
}
