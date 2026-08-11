import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller.js';

const router: Router = Router();
const controller = new InventoryController();

router.get('/items', controller.getItems);
router.post('/items', controller.tagItem);
router.get('/items/:id', controller.getItemById);
router.post('/items/:id/return', controller.returnItem);
router.post('/movements', controller.recordMovement);

export default router;
