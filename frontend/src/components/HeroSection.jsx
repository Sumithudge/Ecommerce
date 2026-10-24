import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { getBanners } from '../services/api.js'

const fallback = [{
  _id: 'fallback',
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
}]

function HeroSection() {
  const [banners, setBanners] = useState(fallback)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let active = true
    getBanners()
      .then(data => {
        if (!active || !Array.isArray(data) || !data.length) return
        setBanners(data)
        setIndex(0)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (banners.length < 2) return undefined
    const timer = window.setInterval(() => {
      setIndex(current => (current + 1) % banners.length)
    }, 5000)
    return () => window.clearInterval(timer)
  }, [banners.length])

  const banner = banners[index] || fallback[0]

  return (
    <section className="relative overflow-hidden bg-[#f8e9ed]">
      <div className="mx-auto grid min-h-[500px] max-w-[1500px] items-center lg:grid-cols-2">
        <div key={banner._id} className="relative z-10 px-6 py-16 transition-opacity duration-500 sm:px-10 lg:px-16 lg:py-20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9d526e]">
            <Sparkles size={14} />
            {banner.badge}
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-[1.02] tracking-[-2px] text-[#24151d] sm:text-6xl lg:text-7xl">
            {banner.title}
            <br />
            <span className="text-[#c76b8b]">{banner.highlight}</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
            {banner.description}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={banner.buttonLink || '/products'} className="group flex items-center gap-3 rounded-full bg-[#24151d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#3b222e]">
              {banner.buttonText || 'Shop Collection'}
              <ArrowRight size={17} className="transition group-hover:translate-x-1" />
            </Link>

            <Link to={banner.secondaryButtonLink || '/products'} className="rounded-full border border-[#24151d] bg-white/60 px-7 py-4 text-sm font-semibold text-[#24151d] transition hover:bg-white">
              {banner.secondaryButtonText || 'Explore New Arrivals'}
            </Link>
          </div>

          <div className="mt-10 flex gap-8">
            <div><p className="text-xl font-bold text-[#24151d]">10K+</p><p className="text-xs text-gray-500">Happy shoppers</p></div>
            <div><p className="text-xl font-bold text-[#24151d]">4.8/5</p><p className="text-xs text-gray-500">Customer rating</p></div>
            <div><p className="text-xl font-bold text-[#24151d]">24/7</p><p className="text-xs text-gray-500">Support</p></div>
          </div>
        </div>

        <div key={`visual-${banner._id}`} className="relative min-h-[420px] lg:h-full">
          <div className="absolute right-[-100px] top-[-50px] h-[450px] w-[450px] rounded-full bg-[#e8bdc9]" />
          <div className="absolute bottom-0 right-[5%] h-[440px] w-[70%] overflow-hidden rounded-t-[180px] bg-gradient-to-b from-[#d59aaa] to-[#8f5269]">
            <img src={banner.image} alt={banner.title || 'Shobhaya Cloth collection'} className="h-full w-full object-cover object-top mix-blend-multiply" />
          </div>
          <div className="absolute bottom-10 left-8 rounded-2xl bg-white/90 px-5 py-4 shadow-xl backdrop-blur sm:left-16">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{banner.trendingLabel}</p>
            <p className="mt-1 font-bold text-[#24151d]">{banner.trendingText}</p>
          </div>
        </div>
      </div>

      {banners.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-white/80 px-3 py-2 backdrop-blur">
          {banners.map((item, itemIndex) => (
            <button
              key={item._id}
              onClick={() => setIndex(itemIndex)}
              aria-label={`Show banner ${itemIndex + 1}`}
              className={`h-2 rounded-full transition-all ${itemIndex === index ? 'w-7 bg-[#24151d]' : 'w-2 bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default HeroSection
