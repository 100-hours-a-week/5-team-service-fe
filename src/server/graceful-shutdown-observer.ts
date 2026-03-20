import { ServerResponse } from "node:http";
import http from "node:http";

type ShutdownState = {
  drainStartedAt: number | null;
  inflightZeroAt: number | null;
  signal: NodeJS.Signals | null;
};

declare global {
  var __gracefulShutdownObserverInstalled: boolean | undefined;
  var __gracefulShutdownObserverState: ShutdownState | undefined;
  var __gracefulShutdownInflightRequests: number | undefined;
}

function getState(): ShutdownState {
  if (!globalThis.__gracefulShutdownObserverState) {
    globalThis.__gracefulShutdownObserverState = {
      drainStartedAt: null,
      inflightZeroAt: null,
      signal: null,
    };
  }

  return globalThis.__gracefulShutdownObserverState;
}

function getInflightRequests() {
  return globalThis.__gracefulShutdownInflightRequests ?? 0;
}

function setInflightRequests(nextCount: number) {
  globalThis.__gracefulShutdownInflightRequests = Math.max(0, nextCount);
}

function toIsoString(timestamp: number | null) {
  return timestamp ? new Date(timestamp).toISOString() : null;
}

function logShutdownEvent(event: string, extra: Record<string, unknown> = {}) {
  const state = getState();

  console.info(
    JSON.stringify({
      event,
      received_sigterm: state.signal === "SIGTERM" ? toIsoString(state.drainStartedAt) : null,
      drain_started_at: toIsoString(state.drainStartedAt),
      inflight_zero_at: toIsoString(state.inflightZeroAt),
      inflight_requests: getInflightRequests(),
      signal: state.signal,
      ...extra,
    }),
  );
}

function markInflightZeroIfNeeded() {
  const state = getState();

  if (state.drainStartedAt === null || state.inflightZeroAt !== null || getInflightRequests() !== 0) {
    return;
  }

  state.inflightZeroAt = Date.now();

  logShutdownEvent("inflight_zero_at", {
    drain_duration_ms: state.inflightZeroAt - state.drainStartedAt,
  });
}

function trackResponseLifecycle(response: ServerResponse) {
  setInflightRequests(getInflightRequests() + 1);

  let finalized = false;

  const finalize = () => {
    if (finalized) {
      return;
    }

    finalized = true;
    setInflightRequests(getInflightRequests() - 1);
    markInflightZeroIfNeeded();
  };

  response.once("finish", finalize);
  response.once("close", finalize);
}

function patchHttpServerRequestTracking() {
  const originalEmit = http.Server.prototype.emit;

  http.Server.prototype.emit = function patchedEmit(event: string, ...args: unknown[]) {
    if (event === "request") {
      const response = args[1];

      if (response instanceof ServerResponse) {
        trackResponseLifecycle(response);
      }
    }

    return Reflect.apply(originalEmit, this, [event, ...args]);
  };
}

function registerShutdownSignal(signal: NodeJS.Signals) {
  process.once(signal, () => {
    const state = getState();

    if (state.drainStartedAt !== null) {
      return;
    }

    state.signal = signal;
    state.drainStartedAt = Date.now();

    logShutdownEvent(signal === "SIGTERM" ? "received_sigterm" : "received_shutdown_signal");
    markInflightZeroIfNeeded();
  });
}

function registerExitLogging() {
  process.once("exit", () => {
    const state = getState();
    const completedAt = Date.now();

    logShutdownEvent("shutdown_completed", {
      remaining_inflight_before_exit: getInflightRequests(),
      shutdown_completed: new Date(completedAt).toISOString(),
      drain_duration_ms:
        state.drainStartedAt === null ? null : completedAt - state.drainStartedAt,
    });
  });
}

export function registerGracefulShutdownObserver() {
  if (globalThis.__gracefulShutdownObserverInstalled) {
    return;
  }

  globalThis.__gracefulShutdownObserverInstalled = true;
  setInflightRequests(getInflightRequests());

  patchHttpServerRequestTracking();
  registerShutdownSignal("SIGTERM");
  registerShutdownSignal("SIGINT");
  registerExitLogging();
}
