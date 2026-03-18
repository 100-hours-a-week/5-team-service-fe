import postBehaviorLog from "../api/postBehaviorLog";
import type {
  BehaviorLogCounter,
  BehaviorLogCounterMap,
  BehaviorLogItem,
  BehaviorLogRequest,
} from "./types";

const SESSION_ID_KEY = "behaviorLog:sessionId";
const COUNTERS_KEY = "behaviorLog:counters";
const PENDING_QUEUE_KEY = "behaviorLog:pendingQueue";

let countersCache: BehaviorLogCounterMap | null = null;
let queueCache: BehaviorLogRequest[] | null = null;
let flushPromise: Promise<void> | null = null;

function isBrowser() {
  return typeof window !== "undefined";
}

function storageGet<T>(key: string): T | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function storageSet<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function storageRemove(key: string) {
  if (!isBrowser()) return;
  localStorage.removeItem(key);
}

function createSessionId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getSessionId() {
  const existing = storageGet<string>(SESSION_ID_KEY);
  if (existing) return existing;
  const sessionId = createSessionId();
  storageSet(SESSION_ID_KEY, sessionId);
  return sessionId;
}

function loadCounters(): BehaviorLogCounterMap {
  if (countersCache) return countersCache;

  const stored = storageGet<Record<string, BehaviorLogCounter>>(COUNTERS_KEY);
  countersCache = Object.entries(stored ?? {}).reduce<BehaviorLogCounterMap>(
    (acc, [key, value]) => {
      const meetingId = Number(key);
      if (!Number.isFinite(meetingId) || meetingId <= 0) return acc;
      acc[meetingId] = {
        impressionCount: Number(value?.impressionCount ?? 0),
        detailClickCount: Number(value?.detailClickCount ?? 0),
        detailDwellTimeMs: Number(value?.detailDwellTimeMs ?? 0),
      };
      return acc;
    },
    {},
  );

  return countersCache;
}

function persistCounters() {
  const counters = loadCounters();
  if (!Object.keys(counters).length) {
    storageRemove(COUNTERS_KEY);
    return;
  }
  storageSet(COUNTERS_KEY, counters);
}

function mergeItems(items: BehaviorLogItem[]): BehaviorLogItem[] {
  const merged = new Map<number, BehaviorLogItem>();

  items.forEach((item) => {
    const existing = merged.get(item.meetingId);
    if (!existing) {
      merged.set(item.meetingId, { ...item });
      return;
    }

    merged.set(item.meetingId, {
      meetingId: item.meetingId,
      impressionCount: existing.impressionCount + item.impressionCount,
      detailClickCount: existing.detailClickCount + item.detailClickCount,
      detailDwellTimeMs: existing.detailDwellTimeMs + item.detailDwellTimeMs,
    });
  });

  return Array.from(merged.values());
}

function mergeRequests(previous: BehaviorLogRequest, next: BehaviorLogRequest): BehaviorLogRequest {
  return {
    sessionId: next.sessionId,
    sentAt: next.sentAt,
    items: mergeItems([...previous.items, ...next.items]),
  };
}

function compactQueue(queue: BehaviorLogRequest[]) {
  if (queue.length <= 1) return queue;

  const mergedBySession = new Map<string, BehaviorLogRequest>();
  queue.forEach((request) => {
    const existing = mergedBySession.get(request.sessionId);
    mergedBySession.set(request.sessionId, existing ? mergeRequests(existing, request) : request);
  });

  return Array.from(mergedBySession.values());
}

function loadQueue() {
  if (queueCache) return queueCache;
  const stored = storageGet<BehaviorLogRequest[]>(PENDING_QUEUE_KEY);
  queueCache = compactQueue(Array.isArray(stored) ? stored : []);
  return queueCache;
}

function persistQueue() {
  const queue = loadQueue();
  if (!queue.length) {
    storageRemove(PENDING_QUEUE_KEY);
    return;
  }
  storageSet(PENDING_QUEUE_KEY, queue);
}

function enqueueRequest(request: BehaviorLogRequest) {
  const queue = loadQueue();
  const lastRequest = queue[queue.length - 1];
  if (lastRequest && lastRequest.sessionId === request.sessionId) {
    queue[queue.length - 1] = mergeRequests(lastRequest, request);
  } else {
    queue.push(request);
  }
  persistQueue();
}

function normalizeMeetingId(meetingId: number) {
  if (!Number.isFinite(meetingId)) return null;
  const normalized = Math.trunc(meetingId);
  if (normalized <= 0) return null;
  return normalized;
}

function updateCounter(
  meetingId: number,
  updater: (previous: BehaviorLogCounter) => BehaviorLogCounter,
) {
  if (!isBrowser()) return;

  const normalizedMeetingId = normalizeMeetingId(meetingId);
  if (!normalizedMeetingId) return;

  const counters = loadCounters();
  const previous = counters[normalizedMeetingId] ?? {
    impressionCount: 0,
    detailClickCount: 0,
    detailDwellTimeMs: 0,
  };

  counters[normalizedMeetingId] = updater(previous);
  persistCounters();
}

export function addMeetingImpressionCount(meetingId: number) {
  updateCounter(meetingId, (previous) => ({
    ...previous,
    impressionCount: previous.impressionCount + 1,
  }));
}

export function addMeetingDetailClickCount(meetingId: number) {
  updateCounter(meetingId, (previous) => ({
    ...previous,
    detailClickCount: previous.detailClickCount + 1,
  }));
}

export function addMeetingDetailDwellTime(meetingId: number, dwellTimeMs: number) {
  if (!Number.isFinite(dwellTimeMs) || dwellTimeMs <= 0) return;
  updateCounter(meetingId, (previous) => ({
    ...previous,
    detailDwellTimeMs: previous.detailDwellTimeMs + Math.round(dwellTimeMs),
  }));
}

function isZeroCounter(counter: BehaviorLogCounter) {
  return (
    counter.impressionCount <= 0 && counter.detailClickCount <= 0 && counter.detailDwellTimeMs <= 0
  );
}

function takeSnapshotAndReset() {
  const counters = loadCounters();
  const snapshot: BehaviorLogCounterMap = {};

  Object.entries(counters).forEach(([meetingId, counter]) => {
    if (isZeroCounter(counter)) return;
    snapshot[Number(meetingId)] = { ...counter };
  });

  countersCache = {};
  persistCounters();
  return snapshot;
}

function snapshotToItems(snapshot: BehaviorLogCounterMap): BehaviorLogItem[] {
  return Object.entries(snapshot).map(([meetingIdRaw, counter]) => ({
    meetingId: Number(meetingIdRaw),
    impressionCount: counter.impressionCount,
    detailClickCount: counter.detailClickCount,
    detailDwellTimeMs: counter.detailDwellTimeMs,
  }));
}

async function flushPendingQueue({ keepalive = false }: { keepalive?: boolean } = {}) {
  const queue = loadQueue();
  if (!queue.length) return;

  let sentCount = 0;
  while (queue.length) {
    const request = queue[0];
    if (!request) break;

    try {
      await postBehaviorLog(request, {
        keepalive,
        timeoutMs: keepalive ? 2500 : 5000,
      });
      queue.shift();
      sentCount += 1;
      if (keepalive) break;
    } catch {
      break;
    }
  }

  if (sentCount > 0) {
    persistQueue();
  }
}

type FlushBehaviorLogsOptions = {
  keepalive?: boolean;
};

export async function flushBehaviorLogs(options: FlushBehaviorLogsOptions = {}) {
  if (!isBrowser()) return;
  if (flushPromise) return flushPromise;

  flushPromise = (async () => {
    const snapshot = takeSnapshotAndReset();
    const items = snapshotToItems(snapshot);
    if (items.length) {
      enqueueRequest({
        sessionId: getSessionId(),
        sentAt: new Date().toISOString(),
        items,
      });
    }

    await flushPendingQueue({ keepalive: options.keepalive });
  })().finally(() => {
    flushPromise = null;
  });

  return flushPromise;
}
