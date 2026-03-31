export const generateBarcodeCode = (
 prefix: string,
 lastNumber: number,
 padding: number
) => {

 const next = lastNumber + 1

 const number = String(next).padStart(padding, "0")

 return {
   code: `${prefix}${number}`,
   next
 }

}