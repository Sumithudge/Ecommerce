import Banner from '../models/Banner.js'

const fallbackBanners = [
  {
    _id: 'default-1',
    badge: 'New Season Collection',
    title: 'Your style.',
    highlight: 'Your story.',
    description: 'Discover effortless fashion made for every version of you. From everyday essentials to statement pieces.',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=1200&q=85',
    buttonText: 'Shop Collection',
    buttonLink: '/products',
    secondaryButtonText: 'Explore New Arrivals',
    secondaryButtonLink: '/products',
    trendingLabel: 'Trending now',
    trendingText: "Spring Edit '26",
  },
  {
    _id: 'default-2',
    badge: 'Fresh Arrivals',
    title: 'Dress your.',
    highlight: 'moment.',
    description: 'New looks, easy styling and everyday pieces curated for your wardrobe.',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85',
    buttonText: 'Shop New Arrivals',
    buttonLink: '/products?newArrival=true',
    secondaryButtonText: 'View Collection',
    secondaryButtonLink: '/products',
    trendingLabel: 'Just dropped',
    trendingText: 'Fresh Arrivals',
  },
]

export async function listBanners(req, res) {
  const banners = await Banner.find({ isActive: true }).sort({ order: 1, createdAt: -1 })
  res.json(banners.length ? banners : fallbackBanners)
}

export async function adminListBanners(req, res) {
  res.json(await Banner.find().sort({ order: 1, createdAt: -1 }))
}

export async function createBanner(req, res) {
  try {
    const banner = await Banner.create(req.body)
    res.status(201).json(banner)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export async function updateBanner(req, res) {
  try {
    const banner = await Banner.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!banner) return res.status(404).json({ message: 'Banner not found' })
    res.json(banner)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export async function deleteBanner(req, res) {
  const banner = await Banner.findByIdAndDelete(req.params.id)
  if (!banner) return res.status(404).json({ message: 'Banner not found' })
  res.json({ message: 'Banner deleted' })
}
