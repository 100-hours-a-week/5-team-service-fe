import Image from "next/image";

type MeetingCoverImageProps = {
  title: string;
  imagePath: string;
};

export default function MeetingCoverImage({ title, imagePath }: MeetingCoverImageProps) {
  return (
    <div className="relative aspect-[4/3] w-full border border-gray-purple bg-gray-100">
      {imagePath ? (
        <Image
          src={imagePath}
          alt={`${title} 대표 이미지`}
          fill
          sizes="(max-width: 500px) 100vw, 500px"
          className="object-cover"
          priority
        />
      ) : null}
    </div>
  );
}
