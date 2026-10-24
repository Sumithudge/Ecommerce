import { Link } from 'react-router-dom'
import { Heart, ShoppingBag, Star } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { toggleWishlist } from '../services/api.js'

function ProductCard({ product }) {
  const [liked, setLiked] = useState(false)
  const { addToCart } = useCart()
  const { user } = useAuth()

  if (!product) return null

  const {
    _id,
    id,
    name,
    title,
    image,
    price,
    originalPrice,
    discount,
    rating,
    reviews,
    category,
  } = product

  const productId = _id || id
  const productName = name || title || 'Fashion Product'

  const productImage =
    image ||
    product.images?.[0] ||
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80'

  const currentPrice = Number(price) || 0
  const oldPrice = Number(originalPrice) || 0

  const calculatedDiscount =
    oldPrice > currentPrice
      ? Math.round(
          ((oldPrice - currentPrice) / oldPrice) * 100
        )
      : 0

  const discountValue =
    Number(discount) || calculatedDiscount

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <article className="group relative min-w-0">
      {/* Image */}
      <div className="relative overflow-hidden rounded-2xl bg-[#f5f2f3]">
        <Link to={`/products/${productId}`} className="block">
          <div className="aspect-[3/4] overflow-hidden">
            <img
              src={productImage}
              alt={productName}
              className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </Link>

        {/* Discount */}
        {discountValue > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-[#24151d] px-2.5 py-1 text-[11px] font-bold text-white">
            {discountValue}% OFF
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={async () => { try { if (user) { const result = await toggleWishlist(productId); setLiked(result.added) } else { setLiked(!liked) } } catch {} }}
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm backdrop-blur transition hover:scale-105"
        >
          <Heart
            size={17}
            strokeWidth={1.8}
            className={
              liked
                ? 'fill-[#c76b8b] text-[#c76b8b]'
                : 'text-gray-700'
            }
          />
        </button>

        {/* Add to bag */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="absolute bottom-3 left-3 right-3 flex translate-y-2 items-center justify-center gap-2 rounded-xl bg-white/95 py-3 text-xs font-bold text-[#24151d] opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag size={15} />
          ADD TO BAG
        </button>
      </div>

      {/* Product information */}
      <div className="px-1 pt-3">
        {category && (
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
            {category}
          </p>
        )}

        <Link to={`/products/${productId}`}>
          <h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-gray-800 transition hover:text-[#c76b8b]">
            {productName}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-md bg-[#f4f8ee] px-2 py-1">
            <Star
              size={12}
              className="fill-[#5c8c46] text-[#5c8c46]"
            />

            <span className="text-[11px] font-bold text-[#466c37]">
              {rating || '4.5'}
            </span>
          </div>

          {reviews && (
            <span className="text-[11px] text-gray-400">
              ({reviews})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="mt-2 flex flex-wrap items-baseline gap-2">
          <span className="text-base font-bold text-[#24151d]">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>

          {oldPrice > currentPrice && (
            <span className="text-xs text-gray-400 line-through">
              ₹{oldPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Mobile add button */}
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#ead9de] py-2.5 text-xs font-bold text-[#8e4d65] transition hover:bg-[#fff5f7] sm:hidden"
        >
          <ShoppingBag size={14} />
          Add to Bag
        </button>
      </div>
    </article>
  )
}

export default ProductCard