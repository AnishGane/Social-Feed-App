export const env = {
  PORT: process.env.PORT || "5000",
  MONGO_URI: process.env.MONGO_URI as string,
  CLIENT_URL: process.env.CLIENT_URL as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
};
