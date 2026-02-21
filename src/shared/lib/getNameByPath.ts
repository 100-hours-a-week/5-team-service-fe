export function getNameByPath<T = unknown>(obj: unknown, path: string): T | undefined {
  if (!obj || !path) return undefined;

  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");

  let cur: unknown = obj;
  for (const k of keys) {
    if (cur == null) return undefined;
    if (typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[k];
  }

  return cur as T;
}
