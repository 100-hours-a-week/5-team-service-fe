import { apiFetch } from "@/lib/api/apiFetch";
import type {
  PresignedFileRequest,
  PresignedFileResponse,
  RequestPresignedUrlsResponse,
} from "../model/types";

export default async function requestPresignedUrls({
  files,
}: {
  files: PresignedFileRequest[];
}): Promise<PresignedFileResponse[]> {
  const response = await apiFetch<RequestPresignedUrlsResponse>("/uploads/presigned-urls", {
    method: "POST",
    body: JSON.stringify({ files }),
  });

  return Array.isArray(response.files) ? response.files : [];
}
