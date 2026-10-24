import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { getWishlist } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Wishlist() {
  const { user } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (!user) return
    getWishlist().then(setItems).catch(() => setItems([]))
  }, [user])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-[#fcfafb]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#c76b8b]">
            Saved for later
          </p>
          <h1 className="mt-1 text-3xl font-black text-[#24151d]">
            My Wishlist
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {items.length} saved products
          </p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-12 text-center ring-1 ring-gray-100">
            <h2 className="text-xl font-black">Your wishlist is empty</h2>
            <p className="mt-2 text-sm text-gray-500">
              Save products you love and find them here.
            </p>
            <Link
              to="/products"
              className="mt-6 inline-block rounded-xl bg-[#24151d] px-6 py-3 font-bold text-white"
            >
              Browse products
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
