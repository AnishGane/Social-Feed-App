import { readFile } from "fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { ApiError } from "./api-error";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const validateImageFile = async (
  file: Express.Multer.File,
): Promise<boolean> => {
  if (file.size > MAX_FILE_SIZE) {
    throw new ApiError("File size exceeds maximum allowed size", 400);
  }

  let buffer: Buffer;
  if (file.buffer) {
    buffer = file.buffer;
  } else if (file.path) {
    buffer = await readFile(file.path);
  } else {
    throw new ApiError("File data not available", 400);
  }

  const fileType = await fileTypeFromBuffer(buffer);

  if (!fileType) {
    throw new ApiError("Invalid file type", 400);
  }

  if (!ALLOWED_TYPES.includes(fileType.mime)) {
    throw new ApiError("Only JPG, PNG and WEBP images are allowed", 400);
  }

  return true;
};
