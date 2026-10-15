const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// 1500 → "25 min", 36000 → "10 h", 259200 → "3 days"
export function formatDuration(seconds: number) {
  if (seconds < HOUR) return `${Math.round(seconds / MINUTE)} min`;
  if (seconds < 2 * DAY) return `${Math.round(seconds / HOUR)} h`;
  return `${Math.round(seconds / DAY)} days`;
}
