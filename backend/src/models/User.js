import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
  addresses: { type: [{ label: String, firstName: String, lastName: String, phone: String, address: { type: String, required: true }, city: String, state: String, pincode: String }], default: [] },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  passwordResetTokenHash: { type: String, default: '' },
  passwordResetExpires: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('User', userSchema)
