export interface POSItem {

  productId: string
  barcode?: string

  metal: "gold" | "silver" | "diamond"

  grossWeight: number
  stoneWeight?: number
  netWeight?: number

  makingCharge?: number
  wastagePercent?: number

  quantity: number
}

export interface POSInvoiceRequest {

  customerId: string
  branchId: string

  items: POSItem[]

  discount?: number

  payments: {
    method: "cash" | "card" | "upi" | "bank"
    amount: number
  }[]
}

export interface POSInvoiceResult {

  subtotal: number
  tax: number
  discount: number
  total: number

  items: any[]
}