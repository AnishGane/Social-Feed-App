import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";
import streamifier from "streamifier";

const uploadImageToCloudinary = async (
  file: Express.Multer.File,
  folder = "social-feed-posts",
): Promise<string> => {
  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
      },
      (error, result) => {
        if (error) {
          reject(error);
        }
        if (!result) {
          return reject(new Error("Cloudinary upload failed"));
        }
        resolve(result);
      },
    );

    const readStream = streamifier.createReadStream(file.buffer);
    readStream.on("error", reject);
    stream.on("error", reject);
    readStream.pipe(stream);
  });

  return result.secure_url;
};

export default uploadImageToCloudinary;
