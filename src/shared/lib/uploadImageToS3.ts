import { apiFetch } from "@/lib/api/apiFetch";

type PresignedUrlResponse = {
  uploadUrl: string;
  key: string;
  headers: Record<string, string[]>;
};

type uploadImageToS3Props = {
  file: File;
  directory: "MEETING" | "PROFILE" | "CHAT";
};

const toPutHeaders = (headers: Record<string, string[]>) => {
  const result: Record<string, string> = {};
  const blocked = new Set(["host"]);
  for (const [k, v] of Object.entries(headers)) {
    const key = k.toLowerCase();
    if (blocked.has(key)) continue;
    if (v?.[0]) result[key] = v[0];
  }
  return result;
};

export async function uploadImageToS3({ file, directory }: uploadImageToS3Props) {
  const request = {
    directory: directory,
    fileName: file.name,
    contentType: file.type,
    fileSize: file.size,
  };

  const presignedResponse = await apiFetch<PresignedUrlResponse>("/uploads/presigned-url", {
    method: "POST",
    body: JSON.stringify(request),
  });

  const { uploadUrl, key, headers } = presignedResponse;

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: toPutHeaders(headers),
    body: file,
  });

  if (!uploadResponse) {
    throw new Error(`S3 이미지 업로드 실패: ${uploadResponse}`);
  }

  return { key };
}
