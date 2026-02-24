export default function formatChatTime(value: string) {
  if (!value) return "";

  const normalized = value.replace(/(\.\d{3})\d+/, "$1");
  const date = new Date(normalized);
  if (Number.isNaN(date.getTime())) return value;

  const hours = date.getHours();
  const period = hours < 12 ? "오전" : "오후";
  const hour12 = hours % 12 || 12;
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${period} ${hour12}시 ${minute}분`;
}
