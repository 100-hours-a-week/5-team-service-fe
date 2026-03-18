import type { MeetingRound } from "../../api/types";
import MeetingParticipation from "./MeetingParticipation";
import BookReportSubmit from "./BookReportSubmit";
import ReviewWriteAction from "./ReviewWriteAction";
import RecommendMeetingTopicSection from "@/features/recommend-meeting-topic/ui/RecommendMeetingTopicSection";

type MyMeetingRoundActionsProps = {
  meetingId: number;
  round: MeetingRound;
  isLeader: boolean;
  onJoinMeeting: (meetingLink: string) => void;
  onOpenBookReport: () => void;
  onOpenReview: () => void;
};

export default function MyMeetingRoundActions({
  meetingId,
  round,
  isLeader,
  onJoinMeeting,
  onOpenBookReport,
  onOpenReview,
}: MyMeetingRoundActionsProps) {
  return (
    <section key={`${round.roundNo}-meeting`} className="space-y-10 animate-fade-in-up">
      <MeetingParticipation round={round} onJoin={onJoinMeeting} />
      <ReviewWriteAction round={round} onOpenReview={onOpenReview} />
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
