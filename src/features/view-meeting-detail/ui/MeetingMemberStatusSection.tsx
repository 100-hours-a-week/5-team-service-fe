import Image from "next/image";

type MeetingMemberStatusSectionProps = {
  sectionRef: (element: HTMLDivElement | null) => void;
  currentCount: number;
  capacity: number;
  profileImages: string[];
};

export default function MeetingMemberStatusSection({
  sectionRef,
  currentCount,
  capacity,
  profileImages,
}: MeetingMemberStatusSectionProps) {
  const remainCount = Math.max(0, capacity - currentCount);

  return (
    <section ref={sectionRef} data-tab="members" className="scroll-mt-16 px-5 py-10">
      <div className="flex items-center gap-2">
        <h2 className="text-[18px] !font-[600] text-gray-900">모임에 함께 할 멤버를 소개합니다.</h2>
      </div>

      <div className="mt-3 text-label leading-relaxed text-gray-500">
        현재 <span className="text-primary !font-[600]">{remainCount}자리</span> 남아있어요!
      </div>

      <div className="mt-6 flex gap-2">
        {profileImages.slice(0, 5).map((src, index) => (
          <div
            key={`${src}-${index}`}
            className="relative h-14 w-14 overflow-hidden rounded-full border-1 border-gray-200 bg-gray-100"
          >
            <Image src={src} alt="참여자 프로필" fill sizes="60px" className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
