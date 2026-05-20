export const isMongoDuplicateKeyError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const mongoError = error as { code?: number; name?: string };

  return (
    mongoError.code === 11000 ||
    mongoError.name === "MongoServerError" ||
    mongoError.name === "MongoError"
  );
};
