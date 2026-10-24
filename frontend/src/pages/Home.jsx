import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import HeroSection from '../components/HeroSection.jsx'
import CategorySection from '../components/CategorySection.jsx'
import PromoBanner from '../components/PromoBanner.jsx'
import TrustBar from '../components/TrustBar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { getProducts } from '../services/api.js'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function ProductSection({ title, subtitle, items }) {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c76b8b]">
              {subtitle}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#24151d] sm:text-4xl">
              {title}
            </h2>
          </div>

          <Link
            to="/products"
            className="hidden items-center gap-2 text-sm font-semibold text-[#9f526e] sm:flex"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((product) => (
            <ProductCard
              key={product._id || product.id}
              product={product}
            />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    let active = true

    getProducts()
      .then(data => {
        if (active) setProducts(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (active) setProducts([])
      })

    return () => {
      active = false
    }
  }, [])

  const featuredProducts = products.slice(0, 5)
  const trendingProducts = products.slice(5, 10).length
    ? products.slice(5, 10)
    : products.slice(0, 5)

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main>
        <HeroSection />
        <TrustBar />
        <CategorySection />
        <PromoBanner />

        {featuredProducts.length > 0 && (
          <ProductSection
            title="Trending now"
            subtitle="What's hot"
            items={featuredProducts}
          />
        )}

        {trendingProducts.length > 0 && (
          <section className="bg-[#fbf6f7]">
            <ProductSection
              title="Everyday favourites"
              subtitle="Made for you"
              items={trendingProducts}
            />
          </section>
        )}

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1100px] rounded-3xl bg-[#f6e4e9] px-6 py-12 text-center sm:px-12">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#a55773]">
              Stay in the loop
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#24151d] sm:text-4xl">
              Get first access to new drops
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-gray-600">
              Sign up for exclusive offers, new collection alerts and
              fashion inspiration.
            </p>

            <div className="mx-auto mt-7 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                placeholder="Your email address"
                className="h-12 flex-1 rounded-full border-0 bg-white px-5 text-sm outline-none ring-1 ring-gray-200 focus:ring-2 focus:ring-[#c76b8b]"
              />

              <button className="h-12 rounded-full bg-[#24151d] px-7 text-sm font-bold text-white transition hover:bg-[#3b222e]">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home
