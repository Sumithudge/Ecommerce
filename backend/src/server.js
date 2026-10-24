import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/products', productRoutes)

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
      `Elora API running on http://localhost:${PORT}`
    )
  })
}

startServer()