type IsPathActiveParams = {
  pathname: string | null;
  href: string;
};

export const isPathActive = ({ pathname, href }: IsPathActiveParams): boolean => {
  if (!pathname) return false;

  if (href === "/") return pathname === "/";

  if (href === "/my") {
    return pathname === "/my" || pathname.startsWith("/my/");
  }

  if (href === "/chats") {
    return pathname === "/chats" || pathname.startsWith("/chats");
  }

  return pathname.startsWith(href);
};
