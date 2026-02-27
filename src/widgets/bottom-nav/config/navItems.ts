import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  UserCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/outline";
import { ComponentType } from "react";
import { FireIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";

type BottomNavItem = {
  key: string;
  label: string;
  href: string;
  Icon: ComponentType<React.SVGProps<SVGSVGElement>>;
};

export const bottomNavItems: BottomNavItem[] = [
  { key: "home", label: "홈", href: "/", Icon: HomeIcon },
  { key: "my-meeting", label: "나의 모임", href: "/my-meeting", Icon: BookOpenIcon },
  { key: "chat", label: "채팅 토론", href: "/chats", Icon: ChatBubbleLeftEllipsisIcon },
  { key: "my", label: "마이페이지", href: "/my", Icon: UserCircleIcon },
] as const;

export const quickCreateItems = [
  { key: "create-meeting", label: "독서 모임 생성", href: "/meeting/create/basic", Icon: FireIcon },
  {
    key: "create-chat",
    label: "채팅 토론 생성",
    href: "/chat/create/1",
    Icon: ChatBubbleOvalLeftEllipsisIcon,
  },
] as const;
