export const stompDestinations = {
  topicChatRoom: (roomId: number | string) => `/topic/chat-rooms/${roomId}`,
  appChatRoomMessages: (roomId: number | string) => `/app/chat-rooms/${roomId}/messages`,
};
