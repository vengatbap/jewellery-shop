import { Request, Response, NextFunction } from "express"
import * as service from "./inventory.service"
import { successResponse } from "../../utils/api-response"

export const createInventoryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await service.createInventoryItem(req.body)

    return successResponse(res, item)
  } catch (error) {
    next(error)
  }
}

export const getInventory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await service.getInventory()

    return successResponse(res, items)
  } catch (error) {
    next(error)
  }
}

export const getInventoryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await service.getInventoryItem(req.params.id)

    return successResponse(res, item)
  } catch (error) {
    next(error)
  }
}