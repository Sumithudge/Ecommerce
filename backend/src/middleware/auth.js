import crypto from 'crypto'
import User from '../models/User.js'

const SECRET = process.env.AUTH_SECRET || 'elora-development-secret'

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = crypto.createHmac('sha256', SECRET).update(body).digest('base64url')
  return body + '.' + signature
}

export function createToken(user) {
  return sign({ id: user._id.toString(), role: user.role, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 })
}

function verify(token) {
  const [body, signature] = String(token || '').split('.')
  if (!body || !signature) return null
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url')
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
  if (payload.exp < Date.now()) return null
  return payload
}

export async function requireAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    const payload = verify(token)
    if (!payload) return res.status(401).json({ message: 'Authentication required' })
    const user = await User.findById(payload.id).select('-passwordHash')
    if (!user || !user.isActive) return res.status(401).json({ message: 'Account unavailable' })
    req.user = user
    next()
  } catch {
    res.status(401).json({ message: 'Invalid authentication token' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Admin access required' })
  next()
}
