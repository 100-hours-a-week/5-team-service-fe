import ChatRoomPage from "@/views/chat-room/ui/Page";

type PageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function Page({ params }: PageProps) {
  const { roomId } = await params;
  const parsedRoomId = Number(roomId);

  return <ChatRoomPage roomId={parsedRoomId} />;
}
