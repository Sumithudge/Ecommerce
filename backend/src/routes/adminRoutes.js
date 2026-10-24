import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth.js'
import { dashboard, listProducts, createProduct, updateProduct, deleteProduct, listOrders, updateOrder, listUsers } from '../controllers/adminController.js'

const router = express.Router()
router.use(requireAuth, requireAdmin)
router.get('/dashboard', dashboard)
router.get('/products', listProducts)
router.post('/products', createProduct)
router.put('/products/:id', updateProduct)
router.delete('/products/:id', deleteProduct)
router.get('/orders', listOrders)
router.patch('/orders/:id', updateOrder)
router.get('/users', listUsers)
export default router
