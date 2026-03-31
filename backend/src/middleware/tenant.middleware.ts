import { Request, Response, NextFunction } from "express"

export function tenantMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {

  const tenantId = req.headers["x-tenant-id"]

  if (!tenantId) {
    return res.status(400).json({
      message: "Tenant ID missing"
    })
  }

  req["tenantId"] = tenantId

  next()

}