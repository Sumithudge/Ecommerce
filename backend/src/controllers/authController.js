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
  if (hash.length !== derived.length) return false
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
    if (error?.code === 11000) return res.status(409).json({ message: 'Email is already registered' })
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

export async function forgotPassword(req, res) {
  try {
    const email = String(req.body.email || '').toLowerCase().trim()
    if (!email) return res.status(400).json({ message: 'Email is required' })
    const user = await User.findOne({ email })
    const message = 'If an account exists for this email, a password reset link has been sent.'
    if (!user || !user.isActive) return res.json({ message })
    const rawToken = crypto.randomBytes(32).toString('hex')
    user.passwordResetTokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000)
    await user.save()
    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',')[0].trim().replace(/\/$/, '')
    const resetUrl = frontendUrl + '/reset-password?token=' + rawToken
    let sent = false
    if (process.env.RESEND_API_KEY && process.env.RESEND_FROM) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + process.env.RESEND_API_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.RESEND_FROM, to: [user.email], subject: 'Reset your Elora password', html: '<p>Reset your Elora password:</p><p><a href="' + resetUrl + '">Reset password</a></p><p>This link expires in 30 minutes.</p>' }),
      })
      sent = response.ok
    }
    if (!sent && process.env.NODE_ENV !== 'production') return res.json({ message, resetUrl })
    res.json({ message })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Unable to process password reset request' })
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ message: 'Reset token and new password are required' })
    if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' })
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({ passwordResetTokenHash: tokenHash, passwordResetExpires: { $gt: new Date() }, isActive: true })
    if (!user) return res.status(400).json({ message: 'This reset link is invalid or expired' })
    user.passwordHash = hashPassword(password)
    user.passwordResetTokenHash = ''
    user.passwordResetExpires = null
    await user.save()
    res.json({ message: 'Password updated successfully. You can now sign in.' })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: 'Unable to reset password' })
  }
}

export async function me(req, res) {
  res.json({ user: req.user })
}
