"use client";

type ToastProps = {
  message: string;
  phase: "ENTER" | "EXIT";
};

export default function Toast({ message, phase }: ToastProps) {
  if (!message) return null;
  const animation = phase === "EXIT" ? "animate-toast-slide-out" : "animate-toast-slide";

  return (
    <div
      className={`${animation} absolute right-5 top-5 rounded-xl bg-primary-purple px-3 py-3 text-caption text-white shadow-[0_8px_18px_rgba(63,69,214,0.35)]`}
    >
      {message}
    </div>
  );
}
