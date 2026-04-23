import dotenv from "dotenv";
dotenv.config();

export const config = {
  baseUrl: process.env.BASE_URL,
  port: process.env.PORT || 4500,
};

console.log("ENV CONFIG:", config);
