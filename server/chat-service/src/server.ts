import "tsconfig-paths/register";
import app from "./app";
import { connectDB } from "@config/db";

const PORT = process.env.PORT || 5009;

app.listen(PORT, () => {
  connectDB();
  console.log(`Chat Service running at http://localhost:${PORT}`);
});
