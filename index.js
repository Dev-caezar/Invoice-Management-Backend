import dotenv from "dotenv";
import connectDB from "./src/config/database.js";
import app from "./src/app.js";

dotenv.config({
  path: ".env",
});

const startServer = async () => {
  try {
    await connectDB();

    app.on("error", (error) => {
      console.error("Server error:", error);
      throw error;
    });

    const PORT = process.env.PORT || 4500;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
