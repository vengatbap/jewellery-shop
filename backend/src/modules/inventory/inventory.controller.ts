import { Request, Response, NextFunction } from "express"
import * as service from "./inventory.service"

export const createInventoryItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await service.createInventoryItem(req.body)

    res.json({
      success: true,
      data: item
    })
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

    res.json({
      success: true,
      data: items
    })
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

    res.json({
      success: true,
      data: item
    })
  } catch (error) {
    next(error)
  }
}