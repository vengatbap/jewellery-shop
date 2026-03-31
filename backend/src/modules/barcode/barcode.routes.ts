
import {Router} from 'express'
import * as controller from './barcode.controller'

const router = Router()
router.post('/generate',controller.generate)
export default router
