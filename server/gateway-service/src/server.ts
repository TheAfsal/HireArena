import "tsconfig-paths/register";
import dotenv from "dotenv";
import app from "./app";
import { logger } from "./app";

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(`Gateway Service is running on http://localhost:${PORT}`);
});
