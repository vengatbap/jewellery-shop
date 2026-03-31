import { Router } from "express"
import * as controller from "./inventory.controller"

const router = Router()

router.post("/", controller.createInventoryItem)
router.get("/", controller.getInventory)
router.get("/:id", controller.getInventoryItem)

export default router