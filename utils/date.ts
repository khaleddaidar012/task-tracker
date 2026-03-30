export function getRelativeTimeString(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return "اليوم";
  if (diffInDays === 1) return "أمس";
  if (diffInDays === 2) return "منذ يومين";
  if (diffInDays < 7) return `منذ ${diffInDays} أيام`;
  if (diffInDays < 14) return "منذ أسبوع";
  if (diffInDays < 30) return `منذ ${Math.floor(diffInDays / 7)} أسابيع`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths === 1) return "منذ شهر";
  if (diffInMonths === 2) return "منذ شهرين";
  if (diffInMonths < 12) return `منذ ${diffInMonths} أشهر`;
  
  return "أكثر من سنة";
}
