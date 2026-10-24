import Product from '../models/Product.js'
import User from '../models/User.js'
import Order from '../models/Order.js'

export async function dashboard(req, res) {
  const [products, users, orders, sales] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'user', isActive: true }),
    Order.countDocuments(),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' } } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
  ])
  res.json({ products, users, orders, revenue: sales[0]?.total || 0 })
}

export async function listProducts(req, res) {
  res.json(await Product.find().sort({ createdAt: -1 }))
}

export async function createProduct(req, res) {
  try { res.status(201).json(await Product.create(req.body)) }
  catch (error) { res.status(400).json({ message: error.message }) }
}

export async function updateProduct(req, res) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) { res.status(400).json({ message: error.message }) }
}

export async function deleteProduct(req, res) {
  const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
  if (!product) return res.status(404).json({ message: 'Product not found' })
  res.json({ message: 'Product archived' })
}

export async function listOrders(req, res) {
  res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 }))
}

export async function updateOrder(req, res) {
  const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json(order)
}

export async function listUsers(req, res) {
  res.json(await User.find({ role: 'user' }).select('-passwordHash').sort({ createdAt: -1 }))
}
