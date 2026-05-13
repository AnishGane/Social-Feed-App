import { ApiError } from "../../utils/api-error";

export const parseTags = (tags?: unknown): string[] => {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags.filter((t) => typeof t === "string");
  }

  if (typeof tags === "string") {
    try {
      const parsed = JSON.parse(tags);
      if (Array.isArray(parsed)) return parsed.filter((t) => typeof t === "string");
    } catch {}

    // fallback: comma-separated
    return tags.split(",").map((t) => t.trim());
  }

  throw new ApiError("Invalid tags format", 400);
};
