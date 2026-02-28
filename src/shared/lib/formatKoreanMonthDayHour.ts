export default function formatKoreanMonthDayHour(value: string | null | undefined) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const period = hour >= 12 ? "오후" : "오전";
  const normalizedHour = hour % 12 || 12;

  return `${month}월 ${day}일 ${period} ${normalizedHour}시`;
}
