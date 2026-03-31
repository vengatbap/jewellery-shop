import { Router } from "express"
import { CustomerController } from "./customer.controller"

const router = Router()

router.post("/", CustomerController.createCustomer)

export default router