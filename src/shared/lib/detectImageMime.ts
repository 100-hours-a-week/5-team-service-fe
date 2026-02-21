export async function detectImageMime(
  file: File,
): Promise<"image/png" | "image/jpeg" | "image/webp" | null> {
  const buffer = await file.slice(0, 16).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const startsWith = (signature: number[]) => signature.every((v, i) => bytes[i] === v);

  if (startsWith([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (startsWith([0xff, 0xd8, 0xff])) return "image/jpeg";
  const isRiff = startsWith([0x52, 0x49, 0x46, 0x46]);
  const isWebp = bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
  if (isRiff && isWebp) return "image/webp";

  return null;
}
