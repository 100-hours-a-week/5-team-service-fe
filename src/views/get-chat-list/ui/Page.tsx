import MainHeader from "@/components/layout/MainHeader";
import ChatList from "@/features/view-chat-list/ui/ChatList";

export default function GetChatRoomsList() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-10 shrink-0 bg-white">
        <MainHeader hasUnread />
      </div>
      <ChatList />
    </div>
  );
}
