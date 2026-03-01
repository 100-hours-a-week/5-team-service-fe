"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { BookSearchIcon, ChevronRight } from "lucide-react";

type Book = {
  title: string;
  authors: string;
  publisher: string;
  thumbnailUrl?: string;
  publishedAt?: string;
  isbn: string;
};

type BookStoreType = "chat" | "meeting";

type BookInputProps = {
  id: string;
  value?: string;
  selectedBook: Book | null;
  returnTo: string;
  emptyText: string;
  storeType?: BookStoreType;
  roundNo?: number;
};

export default function BookSelectInput({
  id,
  selectedBook,
  returnTo,
  emptyText,
  storeType = "chat",
  roundNo,
}: BookInputProps) {
  const router = useRouter();
  const params = new URLSearchParams({ returnTo, store: storeType });
  if (roundNo) {
    params.set("round", String(roundNo));
  }
  const searchUrl = `/book/search?${params.toString()}`;

  return (
    <button
      id={id}
      type="button"
      aria-label="도서 선택"
      onClick={() => router.push(searchUrl)}
      className="flex w-full items-center justify-between rounded-lg border border-1 border-gray-200 px-4 py-4 text-left transition hover:border-primary-purple"
    >
      {selectedBook ? (
        <div className="flex w-full items-center gap-3">
          <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-sm bg-gray-100 border border-1 border-gray-300">
            {selectedBook.thumbnailUrl ? (
              <Image
                className="object-cover"
                fill
                sizes="60px"
                src={selectedBook.thumbnailUrl}
                alt={selectedBook.title}
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-body-2 !font-[600] text-gray-900"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {selectedBook.title}
            </p>
            <p className="text-body-2 !text-[13px] text-gray-500">
              {selectedBook.authors} | {selectedBook.publisher}
            </p>
            {selectedBook.publishedAt ? (
              <p className="text-caption text-gray-500">{selectedBook.publishedAt}</p>
            ) : null}
          </div>
          <div className="ml-3 flex w-[108px] shrink-0 items-center justify-end gap-1">
            <span className="text-caption text-right text-gray-600">다시 선택하기</span>
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      ) : (
        <div className="flex w-full items-center">
          <p id={`${id}_empty`} className="text-label text-gray-400">
            {emptyText}
          </p>
          <span className="text-label !font-[500] text-gray-400 ml-auto">
            <BookSearchIcon className="w-4 h-4" />
          </span>
        </div>
      )}
    </button>
  );
}
