export default function formatRoundTimer(seconds: number) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const remainSeconds = String(safeSeconds % 60).padStart(2, "0");

  return `${minutes}:${remainSeconds}`;
}
