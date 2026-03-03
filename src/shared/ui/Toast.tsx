"use client";

type ToastProps = {
  message: string;
  phase: "ENTER" | "EXIT";
  variant?: "default" | "chat-room";
  onExitAnimationEnd?: () => void;
};

export default function Toast({
  message,
  phase,
  variant = "default",
  onExitAnimationEnd,
}: ToastProps) {
  if (!message) return null;
  const animation =
    variant === "chat-room"
      ? phase === "EXIT"
        ? "animate-toast-chat-slide-out"
        : "animate-toast-chat-slide"
      : phase === "EXIT"
        ? "animate-toast-slide-out"
        : "animate-toast-slide";
  const positionClass = variant === "chat-room" ? "left-1/2 top-50" : "right-5 top-5";
  const textAlignClass = variant === "chat-room" ? "text-center" : "text-left";

  return (
    <div
      className={`${animation} absolute ${positionClass} ${textAlignClass} whitespace-pre-line rounded-xl bg-primary-purple px-3 py-3 text-caption text-white shadow-[0_8px_18px_rgba(63,69,214,0.35)]`}
      onAnimationEnd={phase === "EXIT" ? onExitAnimationEnd : undefined}
    >
      {message}
    </div>
  );
}
