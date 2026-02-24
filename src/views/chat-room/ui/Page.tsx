import ChatRoom from "@/features/chat-room/ui/ChatRoom";

export default function ChatRoomPage({ roomId }: { roomId: number }) {
  return <ChatRoom roomId={roomId} />;
}
