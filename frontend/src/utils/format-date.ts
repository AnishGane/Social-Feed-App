import {
  format,
  formatDistanceToNow,
  formatDistanceToNowStrict,
} from "date-fns";

export const formatPostDate = (date: string | Date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  const formattedDate = format(dateObj, "MMM d");

  const relative = formatDistanceToNowStrict(dateObj);

  const shortRelative = relative
    .replace(" seconds", "s")
    .replace(" second", "s")
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace(" months", "mo")
    .replace(" month", "mo")
    .replace(" years", "y")
    .replace(" year", "y");

  return `${formattedDate} · ${shortRelative} ago`;
};

export const formatCommentDate = (date: string | Date) => {
  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return "Invalid date";
  }

  return formatDistanceToNow(dateObj, {
    addSuffix: true,
  });
};
