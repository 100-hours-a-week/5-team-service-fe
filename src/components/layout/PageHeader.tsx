"use client";

import { useRouter } from "next/navigation";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

type PageHeaderProps = {
  title: string;
  onBack?: () => void;
  showBackButton?: boolean;
};

export default function PageHeader({ title, onBack, showBackButton = true }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="relative flex items-center justify-center border-b border-gray-200 px-6 py-4">
      {showBackButton ? (
        <button
          type="button"
          onClick={onBack ?? router.back}
          className="absolute left-6 flex h-8 w-8 items-center justify-center rounded-full text-gray-700"
          aria-label="뒤로가기"
        >
          <ChevronLeftIcon className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
        </button>
      ) : null}
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
    </div>
  );
}
