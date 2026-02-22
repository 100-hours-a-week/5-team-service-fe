"use client";

import { Client, IMessage, StompHeaders, type StompSubscription } from "@stomp/stompjs";
import {
  ChatRoomMessageOutbound,
  ConnectOptions,
  StateListener,
  StompConnectionState,
  SubscribeHandler,
  SubscribeOptions,
} from "./types";

class StompManager {
  private client: Client | null = null;
  private state: StompConnectionState = "idle";
  private listeners = new Set<StateListener>();
  private subscriptions = new Map<string, StompSubscription>();
  private connectPromise: Promise<void> | null = null;
  private options: ConnectOptions | null = null;

  private setState(next: StompConnectionState) {
    this.state = next;
    this.listeners.forEach((listener) => listener(next));
  }

  private buildBrokerUrl(options: ConnectOptions) {
    const normalizedBase = options.apiBaseUrl.replace(/\/+$/, "");
    const base = normalizedBase.replace(/^http:\/\//, "ws://").replace(/^https:\/\//, "wss://");
    const wsPath = (options.wsPath ?? "/ws").startsWith("/")
      ? (options.wsPath ?? "/ws")
      : `/${options.wsPath ?? "ws"}`;
    return `${base}${wsPath}`;
  }

  private buildConnectHeaders(options: ConnectOptions): StompHeaders {
    const token = options.getAccessToken();
    const headers: StompHeaders = {};

    if (token) {
      headers.Authorization = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    return headers;
  }

  addStateListener(listener: StateListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  getState() {
    return this.state;
  }

  async connect(options: ConnectOptions) {
    if (typeof window === "undefined") return;

    this.options = options;

    if (this.client?.connected) {
      this.setState("connected");
      return;
    }

    if (this.connectPromise) {
      await this.connectPromise;
      return;
    }

    this.setState("connecting");

    this.connectPromise = new Promise<void>((resolve, reject) => {
      const timeoutMs = options.connectionTimeoutMs ?? 8000;
      let settled = false;
      let timeoutId: number | null = null;

      const clearConnectTimeout = () => {
        if (timeoutId == null) return;
        window.clearTimeout(timeoutId);
        timeoutId = null;
      };

      const finishResolve = () => {
        if (settled) return;
        settled = true;
        clearConnectTimeout();
        this.connectPromise = null;
        resolve();
      };

      const finishReject = (error: Error) => {
        if (settled) return;
        settled = true;
        clearConnectTimeout();
        this.connectPromise = null;
        reject(error);
      };

      const client = new Client({
        brokerURL: this.buildBrokerUrl(options),
        connectHeaders: this.buildConnectHeaders(options),
        reconnectDelay: options.reconnectDelay ?? 3000,
        heartbeatIncoming: options.heartbeatIncoming ?? 10000,
        heartbeatOutgoing: options.heartbeatOutgoing ?? 10000,
        connectionTimeout: timeoutMs,
        debug: options.debug ? (message) => console.log("[stomp]", message) : () => {},
        onConnect: () => {
          this.client = client;
          this.setState("connected");
          options.onWebSocketOpen?.();
          finishResolve();
        },
        onStompError: (frame) => {
          this.setState("error");
          options.onStompError?.(frame);
          if (!client.connected) {
            finishReject(new Error("브로커 오류로 인해 STOMP 연결에 실패했습니다."));
          }
        },
        onWebSocketClose: (evt) => {
          this.setState("disconnected");
          options.onWebSocketClose?.(evt);
          if (!client.connected) {
            finishReject(new Error("웹소켓 연결이 끊어져 STOMP 연결에 실패했습니다."));
          }
        },
        onWebSocketError: () => {
          this.setState("error");
          if (!client.connected) {
            finishReject(new Error("웹소켓 오류로 인해 STOMP 연결에 실패했습니다."));
          }
        },
      });

      this.client = client;
      client.activate();

      timeoutId = window.setTimeout(() => {
        if (this.state === "connecting") {
          finishReject(new Error("연결 시도 시간이 초과되어 STOMP 연결에 실패했습니다."));
        }
      }, timeoutMs);
    });

    return this.connectPromise;
  }

  async disconnect() {
    if (!this.client) return;
    this.setState("disconnecting");

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.clear();

    await this.client.deactivate();
    this.client = null;
    this.connectPromise = null;
    this.setState("disconnected");
  }

  subscribeJson<T>(
    destination: string,
    handler: SubscribeHandler<T>,
    options?: SubscribeOptions,
  ): string {
    if (!this.client || !this.client.connected) {
      throw new Error("현재 연결되어 있는 STOMP Client가 존재하지 않습니다.");
    }

    const key = `${destination}:${Date.now()}:${Math.random().toString(16).slice(2)}`;
    const subscription = this.client.subscribe(
      destination,
      (message: IMessage) => {
        try {
          const parsed = JSON.parse(message.body) as T;
          handler(parsed, message);
        } catch {
          console.warn("유효하지 않은 STOMP Payload 입니다.", message.body);
        }
      },
      options?.headers,
    );

    this.subscriptions.set(key, subscription);
    return key;
  }

  unsubscribe(key: string) {
    const subscription = this.subscriptions.get(key);
    if (!subscription) return;
    subscription.unsubscribe();
    this.subscriptions.delete(key);
  }

  publishJson(destination: string, body: ChatRoomMessageOutbound, headers?: StompHeaders) {
    if (!this.client || !this.client.connected) {
      throw new Error("현재 연결되어 있는 STOMP Client가 존재하지 않습니다.");
    }

    this.client.publish({
      destination,
      headers,
      body: JSON.stringify(body),
    });
  }
}

export const stompManager = new StompManager();
