import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";

async function bootstrap() {
  await connectDB();
  app.listen(env.port, () => logger.info(`API running on port ${env.port}`));
}

bootstrap().catch((error) => {
  logger.error(error);
  process.exit(1);
});
