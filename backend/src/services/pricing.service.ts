import { Router } from "express"
import * as controller from "./barcode.controller"

const router = Router()

router.post("/generate", controller.generateBarcode)

router.post("/generate-batch", controller.generateBatch)

router.get("/:code", controller.getByBarcode)

router.post("/print", controller.printLabel)

export default router