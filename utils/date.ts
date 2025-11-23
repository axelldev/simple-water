export function getToday(): string {
  const today = new Date();
  return today.toDateString();
}
