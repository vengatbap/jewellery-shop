import { Request, Response } from "express"
import { CustomerService } from "./customer.service"
import { ApiResponse } from "../../utils/api-response"


export class CustomerController {

  static async createCustomer(req: Request, res: Response) {
    const customer = await CustomerService.create(req.body)
    return ApiResponse.success(res, customer)
}
