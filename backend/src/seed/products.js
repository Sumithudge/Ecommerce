import dotenv from 'dotenv'
import mongoose from 'mongoose'
import Product from '../models/Product.js'

dotenv.config()

const products = [
  {
    name: 'Floral Printed Summer Dress',
    category: 'Dresses',
    description:
      'A beautiful floral printed summer dress designed for a comfortable and stylish look.',
    image:
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80',
    price: 899,
    originalPrice: 1499,
    discount: 40,
    rating: 4.6,
    reviews: 128,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Pink', 'White'],
    newArrival: true,
    stock: 25,
    isActive: true,
  },

  {
    name: 'Elegant Embroidered Kurti',
    category: 'Kurtis',
    description:
      'An elegant embroidered kurti perfect for everyday wear and special occasions.',
    image:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=700&q=80',
    price: 699,
    originalPrice: 1199,
    discount: 42,
    rating: 4.5,
    reviews: 94,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Green'],
    newArrival: true,
    stock: 30,
    isActive: true,
  },
]

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    console.log('MongoDB connected')

    await Product.deleteMany({})

    await Product.insertMany(products)

    console.log(`${products.length} products inserted successfully`)

    const savedProducts = await Product.find()

    console.log(savedProducts)

    await mongoose.disconnect()

    console.log('Database connection closed')
  } catch (error) {
    console.error('Seed error:', error)

    await mongoose.disconnect()

    process.exit(1)
  }
}

seedProducts()