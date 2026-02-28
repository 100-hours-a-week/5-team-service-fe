import MyMeetingDetailPage from "@/views/my-meeting-detail/ui/Page";

type PageProps = {
  params: Promise<{ meetingId: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const parsedMeetingId = Number(resolvedParams.meetingId);
  return <MyMeetingDetailPage meetingId={parsedMeetingId} />;
}
