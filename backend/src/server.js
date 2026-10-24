import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import authRoutes from './routes/authRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import storeRoutes from './routes/storeRoutes.js'

dotenv.config()

if (process.env.NODE_ENV === 'production' && !process.env.AUTH_SECRET) {
  throw new Error('AUTH_SECRET must be configured in production')
}

const app = express()

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map(value => value.trim().replace(/\/$/, ''))
  .filter(Boolean)

const allowedOrigins = new Set([
  ...configuredOrigins,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
])

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true)
    }

    return callback(new Error('CORS blocked origin: ' + origin))
  },
}))

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/store', storeRoutes)

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Elora API is running',
  })
})

const PORT = process.env.PORT || 5000

const startServer = async () => {
  await connectDB()

  app.listen(PORT, () => {
    console.log(
      'Elora API running on http://localhost:' + PORT
    )
  })
}

startServer()
