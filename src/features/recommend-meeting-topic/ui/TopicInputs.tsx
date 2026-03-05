type TopicInputsProps = {
  topics: string[];
  editable: boolean;
  onChangeTopic: (index: number, value: string) => void;
};

export default function TopicInputs({ topics, editable, onChangeTopic }: TopicInputsProps) {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((index) => (
        <div
          key={`meeting-topic-${index}`}
          className="rounded-2xl border border-gray-200 bg-white px-4 py-3"
        >
          <label className="flex items-center gap-2 text-label text-gray-900">
            <span>{index + 1}.</span>
            <input
              value={topics[index] ?? ""}
              onChange={(event) => onChangeTopic(index, event.target.value)}
              placeholder={`주제 ${index + 1}`}
              disabled={!editable}
              className="w-full bg-transparent text-label outline-none disabled:text-gray-500"
            />
          </label>
        </div>
      ))}
    </div>
  );
}
