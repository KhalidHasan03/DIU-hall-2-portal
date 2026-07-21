export function getLocalDateString(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60000);
  return localDate.toISOString().split('T')[0];
}

export function getLocalMonthString(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const localDate = new Date(d.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 7);
}
