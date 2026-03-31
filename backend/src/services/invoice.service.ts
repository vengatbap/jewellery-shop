

export class InvoiceService {
  static async createInvoice(data:any){
    let total = 0
    for(const item of data.items){
      total += item.price * item.qty
    }
    const invoice = await InvoiceRepository.create({
      ...data,
      total
    })
    return invoice
  }
}
export const createInvoice = async (trx: any, data: any) => {

  const [invoice] = await trx.insert("invoices").values({
    customer_id: data.customer_id,
    branch_id: data.branch_id,
    subtotal: data.totals.subtotal,
    tax_amount: data.totals.tax,
    grand_total: data.totals.grand_total
  }).returning()

  for (const item of data.items) {

    await trx.insert("invoice_items").values({
      invoice_id: invoice.id,
      inventory_item_id: item.inventory_item_id,
      gold_rate: item.gold_rate,
      net_weight: item.weight,
      making_charge: item.making_charge,
      wastage_amount: item.wastage,
      total: item.total
    })

  }

  return invoice
}