import app from "./app"
import { env } from "./config/env"
import { connectDB } from "./config/database"
import { connectRedis } from "./config/redis"
import { logger } from "./config/logger"

async function startServer() {

  try {

    await connectDB()

    await connectRedis()

    app.listen(env.PORT, () => {

      logger.info(`🚀 Server running on port ${env.PORT}`)

    })

  } catch (error) {

    logger.error("Server startup failed", error)

    process.exit(1)

  }

}

startServer()