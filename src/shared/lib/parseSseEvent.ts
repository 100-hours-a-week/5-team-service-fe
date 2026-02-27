export const normalizeBase = (value: string) => value.replace(/\/+$/, "");

export type ParsedSseEvent = { event: string | null; data: string };

export const parseSseEvent = (raw: string): ParsedSseEvent | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const lines = trimmed.split("\n");
  let eventName: string | null = null;
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
      continue;
    }
    if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }

  return { event: eventName, data: dataLines.join("\n") };
};
