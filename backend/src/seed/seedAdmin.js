import crypto from 'crypto'
import dotenv from 'dotenv'
import connectDB from '../config/db.js'
import User from '../models/User.js'

dotenv.config()

const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!'

function hashPassword(value) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(value, salt, 64).toString('hex')
  return salt + ':' + hash
}

await connectDB()
const email = (process.env.ADMIN_EMAIL || 'admin@elora.shop').toLowerCase()
const existing = await User.findOne({ email })
if (existing) {
  existing.role = 'admin'
  existing.passwordHash = hashPassword(password)
  existing.isActive = true
  await existing.save()
  console.log('Admin account updated:', email)
} else {
  await User.create({ name: 'Elora Admin', email, passwordHash: hashPassword(password), role: 'admin' })
  console.log('Admin account created:', email)
}
process.exit(0)
