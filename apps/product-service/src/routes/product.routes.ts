import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';

const router: Router = Router();
const controller = new ProductController();

router.get('/templates', controller.getTemplates);
router.post('/templates', controller.createTemplate);
router.get('/templates/:id', controller.getTemplateById);
router.put('/templates/:id', controller.updateTemplate);
router.post('/templates/:id/variants', controller.createVariant);

export default router;
