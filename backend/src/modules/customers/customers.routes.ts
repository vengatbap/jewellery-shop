import { Router } from "express"
import { CustomerController } from "./customers.controller"

const router = Router()

router.post("/", CustomerController.createCustomer)

export default router