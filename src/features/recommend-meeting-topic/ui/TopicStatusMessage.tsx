type TopicStatusMessageProps = {
  isRecommending: boolean;
  recommendMessage: string | null;
};

export default function TopicStatusMessage({
  isRecommending,
  recommendMessage,
}: TopicStatusMessageProps) {
  if (isRecommending) {
    return (
      <p className="text-caption text-gray-500 mb-0">
        생성 중에도 화면을 닫을 수 있어요. 완료되면 입력란이 자동으로 채워집니다.
      </p>
    );
  }

  if (recommendMessage) {
    return <p className="text-caption !font-[500] text-red-500 mb-0">{recommendMessage}</p>;
  }

  return null;
}
