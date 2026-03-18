import ViewMyReviewDetailPage from "@/views/view-my-review-detail/ui/Page";

type PageProps = {
  params: Promise<{ reviewId: string }>;
};

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const parsedReviewId = Number(resolvedParams.reviewId);
  const reviewId = Number.isFinite(parsedReviewId) ? parsedReviewId : NaN;

  return <ViewMyReviewDetailPage reviewId={reviewId} />;
}
