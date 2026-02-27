import { ROUND_GUIDE } from "../model/config";

type ChatDebateGuideProps = {
  currentRound: number;
  isEnded: boolean;
};

export default function ChatDebateGuide({ currentRound, isEnded }: ChatDebateGuideProps) {
  return (
    <div>
      <h2 className="text-body-1 !font-[600] font-semibold text-gray-900">토론 진행 가이드</h2>
      <div className="mt-4 space-y-3">
        {ROUND_GUIDE.map((item, index) => {
          const round = index + 1;
          const isActiveRound = round === currentRound && !isEnded;

          return (
            <div key={item.title} className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                  isActiveRound ? "bg-primary text-gray-purple" : "bg-gray-200 text-gray-blue"
                }`}
              >
                {round}
              </div>
              <div>
                <p className="text-body-1 !font-[600] text-gray-900">{item.title}</p>
                <p className="mt-1 text-body-2 text-gray-500">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
