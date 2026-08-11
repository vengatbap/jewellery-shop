import { Router } from 'express';
import { ProcurementController } from '../controllers/procurement.controller.js';

const router: Router = Router();
const controller = new ProcurementController();

router.get('/suppliers', controller.getSuppliers);
router.post('/suppliers', controller.createSupplier);
router.get('/purchase-orders', controller.getPurchaseOrders);
router.post('/purchase-orders', controller.createPurchaseOrder);
router.post('/goods-receipts', controller.createGoodsReceiptNote);
router.post('/payments', controller.createSupplierPayment);

export default router;
