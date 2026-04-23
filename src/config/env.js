import dotenv from "dotenv";
dotenv.config();

export const config = {
  baseUrl: "https://invoice-management-backend-savm.onrender.com/api",
  port: process.env.PORT || 4500,
};

console.log("ENV CONFIG:", config);
