export const isValidSocialLinkUrl = (value: string) => {
  if (!value) return true;

  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
};
