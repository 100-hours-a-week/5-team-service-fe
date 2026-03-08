type HeaderMap = Record<string, string | string[] | undefined>;

type SentryLikeEvent = {
  request?: {
    headers?: HeaderMap;
  };
  tags?: Record<string, string>;
};

function getHeader(headers: HeaderMap | undefined, target: string) {
  if (!headers) return "";

  const key = Object.keys(headers).find((name) => name.toLowerCase() === target.toLowerCase());
  if (!key) return "";

  const value = headers[key];
  if (Array.isArray(value)) return value[0] ?? "";

  return value ?? "";
}

function resolveDeliveryPath(headers: HeaderMap | undefined) {
  if (!headers) return "unknown";

  const via = getHeader(headers, "via");
  const cfId = getHeader(headers, "x-amz-cf-id");

  if (via.toLowerCase().includes("cloudfront") || cfId) {
    return "cloudfront";
  }

  return "direct-origin";
}

export function applyRequestTagsToEvent<T extends SentryLikeEvent>(event: T) {
  const headers = event.request?.headers;
  const host = getHeader(headers, "host") || "unknown";
  const deliveryPath = resolveDeliveryPath(headers);

  event.tags = {
    ...event.tags,
    delivery_path: deliveryPath,
    host,
  };

  return event;
}
