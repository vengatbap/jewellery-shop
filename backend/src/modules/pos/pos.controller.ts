import { Request, Response } from "express"
import { POSService } from "./pos.service"

export class POSController {

  static async createInvoice(
    req: Request,
    res: Response
  ) {

    const invoice =
      await POSService.createInvoice(
        req.body
      )

    res.json({
      success: true,
      data: invoice
    })
  }
}