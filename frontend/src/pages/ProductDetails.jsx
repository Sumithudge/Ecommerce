import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Star,
} from 'lucide-react'

import Navbar from '../components/Navbar.jsx'
import { getProductById, getReviews, createReview } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [reviewsList, setReviewsList] = useState([])
  const [review, setReview] = useState({ rating: 5, title: '', comment: '' })

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true)
        setError('')

        const data = await getProductById(id)

        setProduct(data)

        if (data?.sizes?.length > 0) {
          setSelectedSize(data.sizes[0])
        }
      } catch (error) {
        console.error(error)
        setError('Unable to load product')
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
    getReviews(id).then(setReviewsList).catch(() => {})
  }, [id])

  const handleAddToCart = () => {
    if (!product) return

    if (
      Array.isArray(product.sizes) &&
      product.sizes.length > 0 &&
      !selectedSize
    ) {
      return
    }

    addToCart({
      ...product,
      quantity,
      selectedSize,
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfafb]">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-12 shadow-sm ring-1 ring-gray-100">
            <p className="text-sm text-gray-500">
              Loading product...
            </p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#fcfafb]">
        <Navbar />

        <main className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-white p-12 shadow-sm ring-1 ring-gray-100">
            <h1 className="text-3xl font-black text-[#24151d]">
              Product not found
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              {error || 'This product is no longer available.'}
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#24151d] px-6 py-3 text-sm font-semibold text-white"
            >
              <ArrowLeft size={17} />
              Back to products
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const sizes = Array.isArray(product.sizes)
    ? product.sizes
    : []

  const colors = Array.isArray(product.colors)
    ? product.colors
    : []

  const price = Number(product.price || 0)
  const originalPrice = Number(
    product.originalPrice || 0
  )

  const discount =
    Number(product.discount || 0) > 0
      ? Number(product.discount)
      : originalPrice > price
        ? Math.round(
            ((originalPrice - price) / originalPrice) *
              100
          )
        : 0

  return (
    <div className="min-h-screen bg-[#fcfafb]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-7 flex items-center gap-2 text-sm text-gray-400">
          <Link
            to="/"
            className="hover:text-[#c76b8b]"
          >
            Home
          </Link>

          <span>/</span>

          <Link
            to="/products"
            className="hover:text-[#c76b8b]"
          >
            Women's Fashion
          </Link>

          <span>/</span>

          <span className="max-w-[220px] truncate text-gray-600">
            {product.name}
          </span>
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Product image */}
          <div>
            <div className="relative overflow-hidden rounded-3xl bg-white ring-1 ring-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="aspect-[4/5] w-full object-cover"
              />

              {discount > 0 && (
                <span className="absolute left-5 top-5 rounded-full bg-[#c34f73] px-4 py-2 text-xs font-bold text-white">
                  {discount}% OFF
                </span>
              )}

              {product.newArrival && (
                <span className="absolute left-5 top-16 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#24151d] shadow-sm">
                  New Arrival
                </span>
              )}

              <button
                type="button"
                className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-md"
              >
                <Heart size={20} />
              </button>
            </div>
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c76b8b]">
              {product.category}
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#24151d] sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-[#fff3f6] px-3 py-1.5">
                <Star
                  size={15}
                  fill="currentColor"
                  className="text-[#c76b8b]"
                />

                <span className="text-sm font-bold text-[#24151d]">
                  {Number(product.rating || 0).toFixed(1)}
                </span>
              </div>

              <span className="text-sm text-gray-500">
                {product.reviews || 0} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-center gap-3">
              <span className="text-3xl font-black text-[#24151d]">
                ₹{price.toLocaleString('en-IN')}
              </span>

              {originalPrice > price && (
                <span className="text-lg text-gray-400 line-through">
                  ₹
                  {originalPrice.toLocaleString(
                    'en-IN'
                  )}
                </span>
              )}

              {discount > 0 && (
                <span className="text-sm font-bold text-[#c34f73]">
                  {discount}% off
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-6 leading-7 text-gray-600">
                {product.description}
              </p>
            )}

            <div className="my-7 border-t border-gray-200" />

            {/* Sizes */}
            {sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#24151d]">
                    Select Size
                  </h2>

                  <button
                    type="button"
                    className="text-xs font-semibold text-[#c76b8b]"
                  >
                    Size Guide
                  </button>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        setSelectedSize(size)
                      }
                      className={`min-w-14 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                        selectedSize === size
                          ? 'border-[#24151d] bg-[#24151d] text-white'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#c76b8b]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mt-7">
                <h2 className="text-sm font-bold text-[#24151d]">
                  Available Colors
                </h2>

                <div className="mt-3 flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + cart */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="flex h-14 items-center justify-between rounded-full border border-gray-200 bg-white px-4 sm:w-36">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.max(1, value - 1)
                    )
                  }
                  className="p-2"
                >
                  <Minus size={17} />
                </button>

                <span className="text-sm font-bold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.min(
                        Number(product.stock || 99),
                        value + 1
                      )
                    )
                  }
                  className="p-2"
                >
                  <Plus size={17} />
                </button>
              </div>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={
                  product.stock === 0 ||
                  (sizes.length > 0 &&
                    !selectedSize)
                }
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-full bg-[#24151d] px-6 text-sm font-bold text-white transition hover:bg-[#3b252f] disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <ShoppingBag size={19} />

                {product.stock === 0
                  ? 'Out of Stock'
                  : 'Add to Bag'}
              </button>
            </div>

            <section className="mt-8 rounded-2xl bg-white p-5 ring-1 ring-gray-100">
              <h2 className="text-lg font-black text-[#24151d]">Customer reviews</h2>
              {user && <form onSubmit={async e=>{e.preventDefault();try{const saved=await createReview(id,review);setReviewsList([saved,...reviewsList.filter(x=>x.user?._id!==user._id)]);setReview({rating:5,title:'',comment:''})}catch{}}} className="mt-4 space-y-3">
                <div className="flex gap-2">{[1,2,3,4,5].map(n=><button type="button" key={n} onClick={()=>setReview({...review,rating:n})}><Star size={20} className={n<=review.rating?'fill-[#c76b8b] text-[#c76b8b]':'text-gray-300'}/></button>)}</div>
                <input value={review.title} onChange={e=>setReview({...review,title:e.target.value})} placeholder="Review title" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"/>
                <textarea value={review.comment} onChange={e=>setReview({...review,comment:e.target.value})} placeholder="Share your experience" rows="3" className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"/>
                <button className="rounded-xl bg-[#24151d] px-5 py-3 text-sm font-bold text-white">Submit review</button>
              </form>}
              <div className="mt-5 space-y-4">{reviewsList.slice(0,6).map(r=><div key={r._id} className="border-t pt-4"><div className="flex justify-between"><b>{r.user?.name||'Customer'}</b><span className="text-sm">★ {r.rating}</span></div><p className="mt-1 font-semibold">{r.title}</p><p className="mt-1 text-sm text-gray-600">{r.comment}</p></div>)}</div>
            </section>

            {/* Delivery information */}
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                <p className="text-xs font-bold text-[#24151d]">
                  Secure Payment
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Safe & secure checkout
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                <p className="text-xs font-bold text-[#24151d]">
                  Easy Returns
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Simple return process
                </p>
              </div>

              <div className="rounded-2xl bg-white p-4 ring-1 ring-gray-100">
                <p className="text-xs font-bold text-[#24151d]">
                  Delivery
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Fast doorstep delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetails