import express from "express"
import cors from "cors"
import helmet from "helmet"

import posRoutes from "./modules/pos/pos.routes"

import { requestIdMiddleware } from "./middleware/request-id.middleware"
import { errorMiddleware } from "./middleware/error.middleware"

const app = express()

app.use(cors())

app.use(helmet())

app.use(express.json())

app.use(requestIdMiddleware)

app.get("/health", (req, res) => {

  res.json({

    status: "OK",

    service: "Jewellery ERP API"

  })

})

app.use("/api/pos", posRoutes)

app.use(errorMiddleware)

export default app