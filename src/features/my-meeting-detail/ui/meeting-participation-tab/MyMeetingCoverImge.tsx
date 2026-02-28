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
      <img
        src={meetingImageUrl}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
