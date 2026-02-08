export const sessionStore = {
  set<T>(key: string, value: T) {
    if (typeof window === "undefined") return;
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  },
  remove(key: string) {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem(key);
  },
};
