import Product from '../models/Product.js'

export async function getProducts(req, res) {
  try {
    const products = await Product.find({
      isActive: true,
    }).sort({ createdAt: -1 })

    res.json(products)
  } catch (error) {
    console.error('Get products error:', error)

    res.status(500).json({
      message: 'Unable to load products',
    })
  }
}

export async function getProductById(req, res) {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    })

    if (!product) {
      return res.status(404).json({
        message: 'Product not found',
      })
    }

    res.json(product)
  } catch (error) {
    console.error('Get product error:', error)

    res.status(500).json({
      message: 'Unable to load product',
    })
  }
}