import mongoose from 'mongoose'

const bannerSchema = new mongoose.Schema(
  {
    badge: { type: String, default: 'New Season Collection', trim: true },
    title: { type: String, required: true, trim: true },
    highlight: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    image: { type: String, required: true, trim: true },
    buttonText: { type: String, default: 'Shop Collection', trim: true },
    buttonLink: { type: String, default: '/products', trim: true },
    secondaryButtonText: { type: String, default: 'Explore New Arrivals', trim: true },
    secondaryButtonLink: { type: String, default: '/products', trim: true },
    trendingLabel: { type: String, default: 'Trending now', trim: true },
    trendingText: { type: String, default: "Spring Edit '26", trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('Banner', bannerSchema)
