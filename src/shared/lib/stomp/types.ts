import type { IFrame, IMessage, StompHeaders } from "@stomp/stompjs";

export type StompConnectionState =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "disconnecting"
  | "error";

export type StateListener = (state: StompConnectionState) => void;

export type ChatMessageType = "TEXT" | "FILE";

export type ChatRoomMessageInbound = {
  messageId: number;
  senderId: number;
  senderNickname: string;
  messageType: ChatMessageType;
  textMessage: string | null;
  filePath: string | null;
  createdAt: string;
};

export type ChatRoomMessageOutbound =
  | {
      clientMessageId: string;
      messageType: "TEXT";
      textMessage: string;
      filePath: null;
    }
  | {
      clientMessageId: string;
      messageType: "FILE";
      textMessage: null;
      filePath: string;
    };

export type SubscribeHandler<T> = (payload: T, raw: IMessage) => void;

export type SubscribeOptions = {
  headers?: StompHeaders;
};

export type ConnectOptions = {
  apiBaseUrl: string;
  wsPath?: string;
  getAccessToken: () => string | null;
  heartbeatIncoming?: number;
  heartbeatOutgoing?: number;
  reconnectDelay?: number;
  connectionTimeoutMs?: number;

  onWebSocketOpen?: () => void;
  onWebSocketClose?: (evt: CloseEvent) => void;
  onStompError?: (frame: IFrame) => void;
  debug?: boolean;
};

export type SubscriptionEntry = {
  key: string;
  destination: string;
  headers?: StompHeaders;
  callback: (msg: IMessage) => void;
};
