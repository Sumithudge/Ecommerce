import crypto from 'crypto'
import User from '../models/User.js'
import { createToken } from '../middleware/auth.js'

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex')
  return salt + ':' + hash
}

function verifyPassword(password, stored) {
  const [salt, hash] = String(stored).split(':')
  if (!salt || !hash) return false
  const derived = crypto.scryptSync(password, salt, 64).toString('hex')
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derived, 'hex'))
}

export async function register(req, res) {
  try {
    const { name, email, password, phone = '' } = req.body
    if (!name?.trim() || !email?.trim() || !password) return res.status(400).json({ message: 'Name, email and password are required' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const normalizedEmail = email.toLowerCase().trim()
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ message: 'Email is already registered' })

    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash: hashPassword(password), phone })
    res.status(201).json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Unable to create account' })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: String(email || '').toLowerCase().trim() })
    if (!user || !user.isActive || !verifyPassword(password || '', user.passwordHash)) return res.status(401).json({ message: 'Invalid email or password' })

    res.json({ token: createToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Unable to sign in' })
  }
}

export async function me(req, res) {
  res.json({ user: req.user })
}
