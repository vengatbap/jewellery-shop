import { Router } from "express"
import { POSController } from "./pos.controller"

const router = Router()

router.post(
  "/invoice",
  POSController.createInvoice
)

export default router