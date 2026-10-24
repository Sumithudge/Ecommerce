import { Link, useLocation } from 'react-router-dom'
import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

const categories = [
  { name: 'New Arrivals', path: '/products?category=New%20Arrivals' },
  { name: 'Dresses', path: '/products?category=Dresses' },
  { name: 'Kurtis', path: '/products?category=Kurtis' },
  { name: 'Sarees', path: '/products?category=Sarees' },
  { name: 'Western Wear', path: '/products?category=Western%20Wear' },
  { name: 'Ethnic Wear', path: '/products?category=Ethnic%20Wear' },
  { name: 'Tops', path: '/products?category=Tops' },
  { name: 'Footwear', path: '/products?category=Footwear' },
  { name: 'Handbags', path: '/products?category=Handbags' },
  { name: 'Jewellery', path: '/products?category=Jewellery' },
  { name: 'Beauty', path: '/products?category=Beauty' },
]

function Navbar() {
  const { cartItems = [] } = useCart()
  const [mobileOpen, setMobileOpen] = useState(false)

  const location = useLocation()

  const isProductsPage =
    location.pathname === '/products'

  const cartCount = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  )

  return (
    <header className="sticky top-0 z-50 bg-white">

      {/* Announcement */}
      <div className="bg-[#24151d] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">
        ✨ Free delivery on orders above ₹1,500
        <span className="mx-2">•</span>
        Easy returns
        <span className="mx-2">•</span>
        Secure payments
      </div>

      {/* Main Navbar */}
      <div className="border-b border-gray-100">

        <div className="mx-auto flex h-[74px] max-w-[1500px] items-center gap-4 px-4 lg:px-8">

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 lg:hidden"
            aria-label="Open menu"
          >
            {mobileOpen ? (
              <X size={23} />
            ) : (
              <Menu size={23} />
            )}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="mr-2 flex shrink-0 items-center"
          >
            <div className="text-[28px] font-black tracking-[-1.5px] text-[#24151d] sm:text-[32px]">
              S<span className="text-[#c76b8b]">ho</span>bhaya Cloth
            </div>
          </Link>

          {/* Global search
              Hidden on Products page because Products
              already has its own search + sort toolbar. */}
          {!isProductsPage && (
            <div className="relative hidden max-w-[620px] flex-1 md:block">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                placeholder="Search for dresses, kurtis, sarees, handbags..."
                className="h-12 w-full rounded-full border border-gray-200 bg-[#faf9fa] pl-12 pr-5 text-[15px] outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#c76b8b] focus:bg-white"
              />

            </div>
          )}

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 sm:gap-3">

            <Link to="/account" className="hidden items-center gap-2 px-2 py-2 lg:flex">
              <UserRound
                size={21}
                strokeWidth={1.7}
              />

              <span className="text-sm font-medium">
                Account
              </span>
            </Link>

            <button
              className="relative hidden p-2 sm:block"
              aria-label="Wishlist"
            >
              <Heart
                size={22}
                strokeWidth={1.7}
              />
            </button>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 p-2"
            >
              <ShoppingBag
                size={23}
                strokeWidth={1.7}
              />

              <span className="hidden text-sm font-medium lg:block">
                Cart
              </span>

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c76b8b] px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>

        {/* Mobile search */}
        {!isProductsPage && (
          <div className="px-4 pb-3 md:hidden">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                placeholder="Search dresses, kurtis, sarees..."
                className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-[#c76b8b]"
              />

            </div>

          </div>
        )}
      </div>

      {/* Categories */}
      <nav className="hidden border-b border-gray-100 bg-white lg:block">

        <div className="mx-auto flex max-w-[1500px] items-center justify-center gap-6 overflow-x-auto px-6">

          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="whitespace-nowrap py-4 text-sm font-medium text-gray-700 transition hover:text-[#c76b8b]"
            >
              {category.name}
            </Link>
          ))}

          {/* About */}
          <Link
            to="/about"
            className="whitespace-nowrap py-4 text-sm font-medium text-gray-700 transition hover:text-[#c76b8b]"
          >
            About Us
          </Link>

          {/* Sale */}
          <Link
            to="/products?category=Sale"
            className="whitespace-nowrap py-4 text-sm font-semibold text-[#c34f73] transition hover:text-[#a83d5e]"
          >
            Sale
          </Link>

        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-b border-gray-100 bg-white lg:hidden">

          <div className="grid grid-cols-2 gap-1 p-4">

            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-[#fff4f7]"
              >
                {category.name}
              </Link>
            ))}

            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 hover:bg-[#fff4f7]"
            >
              About Us
            </Link>

            <Link
              to="/products?category=Sale"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-[#c34f73] hover:bg-[#fff4f7]"
            >
              Sale
            </Link>

          </div>
        </div>
      )}

    </header>
  )
}

export default Navbar