export type BehaviorLogItem = {
  meetingId: number;
  impressionCount: number;
  detailClickCount: number;
  detailDwellTimeMs: number;
};

export type BehaviorLogRequest = {
  sessionId: string;
  sentAt: string;
  items: BehaviorLogItem[];
};

export type BehaviorLogCounter = Omit<BehaviorLogItem, "meetingId">;

export type BehaviorLogCounterMap = Record<number, BehaviorLogCounter>;
