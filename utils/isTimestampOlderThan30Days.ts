export function isTimestampOlderThan30Days(timestamp: string): boolean {
  const timestampDate = new Date(timestamp);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return timestampDate < thirtyDaysAgo;
}
