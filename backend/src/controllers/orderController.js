import Order from '../models/Order.js'
import Product from '../models/Product.js'
import Coupon from '../models/Coupon.js'

export async function createOrder(req, res) {
  try {
    const { items, shippingAddress, paymentMethod = 'cod', couponCode = '' } = req.body
    if (paymentMethod !== 'cod') return res.status(400).json({ message: 'Shobhaya Cloth accepts Cash on Delivery only' })
    if (!Array.isArray(items) || !items.length) return res.status(400).json({ message: 'Cart is empty' })

    const productIds = items.map(item => item.productId || item._id)
    const products = await Product.find({ _id: { $in: productIds }, isActive: true })
    const byId = new Map(products.map(p => [p._id.toString(), p]))
    let subtotal = 0

    const normalizedItems = items.map(item => {
      const product = byId.get(String(item.productId || item._id))
      if (!product) throw new Error('One or more products are unavailable')
      const quantity = Math.max(1, Number(item.quantity || 1))
      if (product.stock < quantity) throw new Error(product.name + ' is out of stock')
      subtotal += product.price * quantity
      return { product: product._id, name: product.name, image: product.image, price: product.price, quantity, selectedSize: item.selectedSize || '' }
    })

    const shipping = subtotal >= 1500 ? 0 : 80
    let couponDiscount = 0

    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: String(couponCode).toUpperCase(),
        active: true,
      })

      if (!coupon || (coupon.expiresAt && coupon.expiresAt < new Date()) || subtotal < coupon.minOrder) {
        return res.status(400).json({ message: 'Invalid or unavailable coupon' })
      }

      couponDiscount = coupon.type === 'percent'
        ? subtotal * coupon.value / 100
        : coupon.value

      if (coupon.maxDiscount > 0) couponDiscount = Math.min(couponDiscount, coupon.maxDiscount)
      couponDiscount = Math.min(Math.round(couponDiscount), subtotal)
    }

    const promotionalDiscount = subtotal >= 3000 ? 500 : 0
    const discount = Math.max(couponDiscount, promotionalDiscount)
    const total = Math.max(0, subtotal + shipping - discount)
    const order = await Order.create({ user: req.user._id, items: normalizedItems, shippingAddress, subtotal, shipping, discount, total, paymentMethod })
    await Promise.all(normalizedItems.map(item => Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } })))
    res.status(201).json(order)
  } catch (error) { res.status(400).json({ message: error.message }) }
}

export async function myOrders(req, res) {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }))
}

export async function myOrder(req, res) {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id })
  if (!order) return res.status(404).json({ message: 'Order not found' })
  res.json(order)
}
