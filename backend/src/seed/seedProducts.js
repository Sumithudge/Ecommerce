import 'dotenv/config'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

const products = [
  {
    name: 'Floral Printed Summer Dress',
    category: 'Dresses',
    description:
      'A beautiful floral printed summer dress designed for comfortable everyday styling.',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80',
    price: 899,
    originalPrice: 1499,
    discount: 40,
    rating: 4.6,
    reviews: 128,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Pink', 'White'],
    isNew: true,
    stock: 25,
    isActive: true,
  },

  {
    name: 'Elegant Embroidered Kurti',
    category: 'Kurtis',
    description:
      'Elegant embroidered kurti perfect for casual and festive occasions.',
    image:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=700&q=80',
    price: 699,
    originalPrice: 1199,
    discount: 42,
    rating: 4.5,
    reviews: 94,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'White'],
    isNew: true,
    stock: 30,
    isActive: true,
  },
]

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)

    console.log('MongoDB connected')

    await Product.deleteMany({})

    await Product.insertMany(products)

    console.log(`${products.length} products inserted successfully`)

    await mongoose.disconnect()

    process.exit(0)
  } catch (error) {
    console.error('Seed error:', error)

    await mongoose.disconnect()

    process.exit(1)
  }
}

seedProducts()