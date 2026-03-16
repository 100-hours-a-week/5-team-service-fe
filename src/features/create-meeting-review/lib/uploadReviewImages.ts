import requestPresignedUrls from "../api/requestPresignedUrls";

const BLOCKED_HEADERS = new Set(["host"]);

function toPutHeaders(headers: Record<string, string[]>) {
  const result: Record<string, string> = {};

  for (const [rawKey, values] of Object.entries(headers)) {
    const key = rawKey.toLowerCase();
    if (BLOCKED_HEADERS.has(key)) continue;
    if (values?.[0]) result[key] = values[0];
  }

  return result;
}

export default async function uploadReviewImages(files: File[]) {
  if (!files.length) return [];

  const presignedFiles = await requestPresignedUrls({
    files: files.map((file) => ({
      directory: "REVIEW",
      fileName: file.name,
      contentType: file.type || "application/octet-stream",
      fileSize: file.size,
    })),
  });

  if (presignedFiles.length !== files.length) {
    throw new Error("이미지 업로드 URL 발급에 실패했습니다.");
  }

  await Promise.all(
    presignedFiles.map(async (presigned, index) => {
      const file = files[index];
      const response = await fetch(presigned.uploadUrl, {
        method: "PUT",
        headers: toPutHeaders(presigned.headers),
        body: file,
      });

      if (!response.ok) {
        throw new Error("이미지 업로드에 실패했습니다.");
      }
    }),
  );

  return presignedFiles.map((item) => item.key);
}
