import { Request, Response } from "express"
import { CustomerService } from "./customers.service"


export class CustomerController {

  static async createCustomer(req: Request, res: Response) {
    const customer = await CustomerService.create(req.body)
    res.json({
      success: true,
      data: customer
    })
  }
}
