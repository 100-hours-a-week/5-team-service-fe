import type { MeetingRound } from "../../api/types";
import MeetingParticipation from "./MeetingParticipation";
import BookReportSubmit from "./BookReportSubmit";
import RecommendMeetingTopicSection from "@/features/recommend-meeting-topic/ui/RecommendMeetingTopicSection";

type MyMeetingRoundActionsProps = {
  meetingId: number;
  round: MeetingRound;
  isLeader: boolean;
  onJoinMeeting: (meetingLink: string) => void;
  onOpenBookReport: () => void;
};

export default function MyMeetingRoundActions({
  meetingId,
  round,
  isLeader,
  onJoinMeeting,
  onOpenBookReport,
}: MyMeetingRoundActionsProps) {
  return (
    <section key={`${round.roundNo}-meeting`} className="space-y-10 animate-fade-in-up">
      <MeetingParticipation round={round} onJoin={onJoinMeeting} />
      <BookReportSubmit round={round} onOpenBookReport={onOpenBookReport} />
      {isLeader ? (
        <RecommendMeetingTopicSection
          meetingId={meetingId}
          roundId={round.roundId}
          roundNo={round.roundNo}
          initialTopics={round.topics}
          editable={round.dday >= 0}
        />
      ) : null}
    </section>
  );
}
