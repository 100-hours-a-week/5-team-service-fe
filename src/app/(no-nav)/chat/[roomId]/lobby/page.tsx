import ChatLobbyPage from "@/views/chat-lobby/ui/Page";

type PageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { roomId } = await params;
  const parsedRoomId = Number(roomId);

  if (Number.isNaN(parsedRoomId)) {
    return <div className="p-6 text-sm text-gray-500">잘못된 채팅방 ID입니다.</div>;
  }

  return <ChatLobbyPage roomId={parsedRoomId} />;
}
