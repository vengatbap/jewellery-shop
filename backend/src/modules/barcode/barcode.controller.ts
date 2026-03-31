
import {Request,Response} from 'express'

export const generate = async(req:Request,res:Response)=>{
 const barcode = 'JR000001'
 res.json({ success:true, barcode })
}
