import z from "zod";
import { CreateMeetingReviewSchema } from "./schema";

export type GetReviewCandidateMembersParams = {
  meetingId: number;
  meetingRoundId: number;
};

export type ReviewCandidateMember = {
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
};

export type GetReviewCandidateMembersResponse = {
  members: ReviewCandidateMember[];
};

export type CreateMeetingRoundReviewRequest = {
  meetingRating: number;
  leaderRating: number;
  content: string;
  bestMemberId: number;
  imageKeys: string[];
};

export type CreateMeetingRoundReviewResponse = {
  reviewId: number;
};

export type PresignedFileRequest = {
  directory: "PROFILE" | "MEETING" | "CHAT" | "REVIEW";
  fileName: string;
  contentType: string;
  fileSize: number;
};

export type PresignedFileResponse = {
  uploadUrl: string;
  key: string;
  headers: Record<string, string[]>;
};

export type RequestPresignedUrlsResponse = {
  files?: PresignedFileResponse[];
};

export type CreateMeetingReviewFormValues = z.infer<typeof CreateMeetingReviewSchema>;

export const createMeetingReviewDefaultValues: CreateMeetingReviewFormValues = {
  meetingRating: 0,
  leaderRating: 0,
  content: "",
  bestMemberId: 0,
  images: [],
};
