import { BookText, Users } from "lucide-react";
import Image from "next/image";

type ChatCardProps = {
  roomName: string;
  description: string;
  currentMembers: number;
  capacity: number;
  bookTitle: string;
  bookAuthor: string;
  bookThumbnailUrl: string;
  onJoin?: () => void;
};

export default function ChatCard({
  roomName,
  description,
  currentMembers,
  capacity,
  bookTitle,
  bookAuthor,
  bookThumbnailUrl,
  onJoin,
}: ChatCardProps) {
  const displayBookTitle = bookTitle.length > 20 ? `${bookTitle.slice(0, 20)}...` : bookTitle;
  const lastSeat = capacity - currentMembers === 1;

  return (
    <article
      className="h-38 rounded-2xl border border-gray-200 bg-white p-4 shadow-[0_6px_20px_rgba(20,24,40,0.05)]"
      onClick={onJoin}
    >
      <div className="flex h-full items-start gap-4">
        <section
          className="relative h-30 w-22 shrink-0 overflow-hidden rounded-lg bg-gray-200"
          aria-label="토론 도서 표시"
        >
          {bookThumbnailUrl ? (
            <Image
              src={bookThumbnailUrl}
              alt={bookTitle}
              fill
              sizes="88px"
              className="object-cover"
            />
          ) : null}
        </section>
        <div className="min-w-0 flex-1 h-full flex flex-col justify-between">
          <section className="flex gap-2">
            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary-purple-3 px-2.5 py-1 text-caption !font-[600] text-primary sm:px-3">
              <BookText className="w-3 h-3" />
              <span>{displayBookTitle}</span>
            </span>
            <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-primary-purple-3 px-2.5 py-1 text-caption !font-[600] text-primary sm:px-3">
              <span>{`${bookAuthor}`}</span>
            </span>
          </section>
          <section>
            <h3 className="truncate text-body-emphasis text-gray-900" aria-label="채팅 토론방 이름">
              {roomName}
            </h3>
            <p className="mt-1 line-clamp-2 text-label !font-[400] text-gray-500">{description}</p>
          </section>
          <section className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-body-2 text-gray-700">
              <Users className="h-4 w-4" aria-hidden="true" />
              <span className="!font-[600]">
                {currentMembers}/{capacity}명
              </span>
              {lastSeat ? (
                <span className="text-caption !font-[600] text-primary ml-1">
                  한 자리 남았어요!
                </span>
              ) : null}
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
