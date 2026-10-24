import express from 'express'
import { createOrder, myOrders, myOrder } from '../controllers/orderController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)
router.post('/', createOrder)
router.get('/', myOrders)
router.get('/:id', myOrder)
export default router
