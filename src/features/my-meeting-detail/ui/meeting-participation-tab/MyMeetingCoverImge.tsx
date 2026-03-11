import Image from "next/image";

type MyMeetingCoverImageProps = {
  meetingImageUrl: string | null | undefined;
  alt: string;
};

export default function MyMeetingCoverImage({ meetingImageUrl, alt }: MyMeetingCoverImageProps) {
  if (!meetingImageUrl) {
    return <div className="relative aspect-[4/3] w-full bg-gray-100" />;
  }

  return (
    <div className="relative aspect-[4/3] w-full border border-1 border-gray-purple">
      <Image
        src={meetingImageUrl}
        alt={alt}
        fill
        sizes="(max-width: 500px) 100vw, 500px"
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
