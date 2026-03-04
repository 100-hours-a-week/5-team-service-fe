import { sessionStore } from "@/shared/lib/storage/seesionStorage";

const buildVoteExpiresAtKey = (roomId: number) => `chat-room:${roomId}:vote-expires-at`;

export const saveVoteExpiresAt = (roomId: number, voteExpiresAt: string) => {
  sessionStore.set(buildVoteExpiresAtKey(roomId), voteExpiresAt);
};

export const consumeVoteExpiresAt = (roomId: number): string | null => {
  const key = buildVoteExpiresAtKey(roomId);
  const value = sessionStore.get<string>(key);
  sessionStore.remove(key);
  return value;
};
