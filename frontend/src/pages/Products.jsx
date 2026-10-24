import { useEffect, useMemo, useState } from 'react'
import {  useSearchParams } from 'react-router-dom'
import { getProducts } from '../services/api.js'
import {
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'

import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'

const categories = [
  'All',
  'New Arrivals',
  'Dresses',
  'Kurtis',
  'Sarees',
  'Western Wear',
  'Ethnic Wear',
  'Tops',
  'Footwear',
  'Handbags',
  'Jewellery',
  'Beauty',
  'Sale',
]

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function Products() {
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedCategory =
    searchParams.get('category') || 'All'

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [selectedSizes, setSelectedSizes] = useState([])
  const [mobileFilters, setMobileFilters] = useState(false)

  const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  const loadProducts = async () => {
    try {
      setLoading(true)

      const data = await getProducts()

      setProducts(data)
    } catch (error) {
      console.error(error)
      setError('Unable to load products')
    } finally {
      setLoading(false)
    }
  }

  loadProducts()
}, [])

  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products)
      ? products
      : []

    let result = [...safeProducts]

    /* ---------------- CATEGORY ---------------- */

    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Sale') {
        result = result.filter(
          (product) =>
            Number(product.discount || 0) > 0 ||
            Number(product.originalPrice || 0) >
              Number(product.price || 0)
        )
      } else if (selectedCategory === 'New Arrivals') {
        result = result.filter(
          (product) =>
            product.newArrival === true || product.isNew === true ||
            product.newArrival === true ||
            product.badge === 'New'
        )
      } else {
        result = result.filter(
          (product) =>
            String(product.category || '')
              .toLowerCase() ===
            selectedCategory.toLowerCase()
        )
      }
    }

    /* ---------------- SEARCH ---------------- */

    if (search.trim()) {
      const query = search.toLowerCase().trim()

      result = result.filter((product) => {
        const name = String(
          product.name ||
            product.title ||
            ''
        ).toLowerCase()

        const category = String(
          product.category || ''
        ).toLowerCase()

        const description = String(
          product.description || ''
        ).toLowerCase()

        return (
          name.includes(query) ||
          category.includes(query) ||
          description.includes(query)
        )
      })
    }

    /* ---------------- PRICE ---------------- */

    result = result.filter(
      (product) =>
        Number(product.price || 0) <= maxPrice
    )

    /* ---------------- SIZE ---------------- */

    if (selectedSizes.length > 0) {
      result = result.filter((product) => {
        const productSizes = Array.isArray(
          product.sizes
        )
          ? product.sizes
          : []

        return selectedSizes.some((size) =>
          productSizes.includes(size)
        )
      })
    }

    /* ---------------- SORT ---------------- */

    if (sort === 'low') {
      result.sort(
        (a, b) =>
          Number(a.price || 0) -
          Number(b.price || 0)
      )
    }

    if (sort === 'high') {
      result.sort(
        (a, b) =>
          Number(b.price || 0) -
          Number(a.price || 0)
      )
    }

    if (sort === 'discount') {
      result.sort(
        (a, b) =>
          Number(b.discount || 0) -
          Number(a.discount || 0)
      )
    }

    return result
  }, [
    products,
    selectedCategory,
    search,
    maxPrice,
    selectedSizes,
    sort,
  ])

  /* ---------------- CATEGORY CHANGE ---------------- */

  const changeCategory = (category) => {
    if (category === 'All') {
      setSearchParams({})
    } else {
      setSearchParams({
        category,
      })
    }
  }

  /* ---------------- SIZE ---------------- */

  const toggleSize = (size) => {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter(
            (item) => item !== size
          )
        : [...current, size]
    )
  }

  /* ---------------- CLEAR ---------------- */

  const clearFilters = () => {
    setSearch('')
    setMaxPrice(5000)
    setSelectedSizes([])
    setSort('popular')
    setSearchParams({})
  }

  return (
    <div className="min-h-screen bg-[#fcfafb]">

      <Navbar />

      <main>

        {/* =====================================================
            PAGE HEADER
        ====================================================== */}

        <section className="border-b border-gray-100 bg-white">

          <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#c76b8b]">
                  Women's Collection
                </p>

                <h1 className="mt-2 text-3xl font-black tracking-tight text-[#24151d] sm:text-4xl">
                  {selectedCategory === 'All'
                    ? "Women's Fashion"
                    : selectedCategory}
                </h1>

                <p className="mt-2 max-w-xl text-sm text-gray-500">
                  Discover styles made for every mood,
                  moment and occasion.
                </p>

              </div>

              <div className="text-sm text-gray-500">

                <span className="font-semibold text-gray-900">
                  {filteredProducts.length}
                </span>{' '}

                {filteredProducts.length === 1
                  ? 'product'
                  : 'products'}

              </div>

            </div>

          </div>

        </section>

        {/* =====================================================
            CATEGORY NAVIGATION
        ====================================================== */}

        <section className="border-b border-gray-100 bg-white">

          <div className="mx-auto max-w-[1400px] overflow-x-auto px-4 sm:px-6 lg:px-8">

            <div className="flex min-w-max gap-2 py-4">

              {categories.map((category) => {

                const active =
                  selectedCategory === category

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() =>
                      changeCategory(category)
                    }
                    className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
                      active
                        ? 'bg-[#24151d] text-white shadow-sm'
                        : 'border border-gray-200 bg-white text-gray-600 hover:border-[#c76b8b] hover:text-[#c76b8b]'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}

            </div>

          </div>

        </section>

        {/* =====================================================
            PRODUCTS AREA
        ====================================================== */}

        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">

          {/* ===================================================
              TOOLBAR
          ==================================================== */}

          <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4 lg:flex-row lg:items-center lg:justify-between">

            {/* Search */}

            <div className="relative w-full lg:max-w-xl">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search dresses, kurtis, sarees, handbags..."
                className="h-11 w-full rounded-full border border-gray-200 bg-[#faf9fa] pl-11 pr-5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#c76b8b] focus:bg-white"
              />

            </div>

            {/* Right controls */}

            <div className="flex w-full items-center gap-2 lg:w-auto">

              {/* Mobile filters */}

              <button
                type="button"
                onClick={() =>
                  setMobileFilters(true)
                }
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium lg:hidden"
              >
                <SlidersHorizontal size={17} />
                Filters
              </button>

              {/* Sort */}

              <div className="relative w-full sm:w-auto">

                <select
                  value={sort}
                  onChange={(event) =>
                    setSort(event.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-full border border-gray-200 bg-white py-0 pl-4 pr-11 text-sm font-medium outline-none focus:border-[#c76b8b] sm:min-w-[190px]"
                >
                  <option value="popular">
                    Sort: Popular
                  </option>

                  <option value="low">
                    Price: Low to High
                  </option>

                  <option value="high">
                    Price: High to Low
                  </option>

                  <option value="discount">
                    Biggest Discount
                  </option>
                </select>

                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                />

              </div>

            </div>

          </div>

          {/* ===================================================
              FILTERS + PRODUCTS
          ==================================================== */}

          <div className="mt-7 grid gap-8 lg:grid-cols-[230px_1fr]">

            {/* Desktop filter */}

            <aside className="hidden lg:block">

              <FilterPanel
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                selectedSizes={selectedSizes}
                toggleSize={toggleSize}
                clearFilters={clearFilters}
              />

            </aside>

            {/* Products */}

            <section>

              {filteredProducts.length > 0 ? (

                <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 xl:grid-cols-4">

                  {filteredProducts.map(
                    (product) => (
                      <ProductCard
                        key={product._id || product.id}
                        product={product}
                      />
                    )
                  )}

                </div>

              ) : (

                <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl bg-white px-6 text-center ring-1 ring-gray-100">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8e8ed]">

                    <Search
                      size={25}
                      className="text-[#c76b8b]"
                    />

                  </div>

                  <h2 className="mt-5 text-xl font-bold text-[#24151d]">
                    No products found
                  </h2>

                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Try changing your search or
                    filters to discover more products.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 rounded-full bg-[#24151d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3b252f]"
                  >
                    Clear filters
                  </button>

                </div>

              )}

            </section>

          </div>

        </div>

      </main>

      {/* =====================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      {mobileFilters && (

        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* Overlay */}

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() =>
              setMobileFilters(false)
            }
          />

          {/* Drawer */}

          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-6">

            <div className="mb-6 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <Filter size={19} />

                <h2 className="font-bold text-[#24151d]">
                  Filters
                </h2>

              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFilters(false)
                }
                className="rounded-full bg-gray-100 p-2"
              >
                <X size={18} />
              </button>

            </div>

            <FilterPanel
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              selectedSizes={selectedSizes}
              toggleSize={toggleSize}
              clearFilters={clearFilters}
            />

            <button
              type="button"
              onClick={() =>
                setMobileFilters(false)
              }
              className="mt-8 w-full rounded-full bg-[#24151d] py-4 text-sm font-bold text-white"
            >
              Show {filteredProducts.length}{' '}
              {filteredProducts.length === 1
                ? 'Product'
                : 'Products'}
            </button>

          </div>

        </div>

      )}

    </div>
  )
}

/* =========================================================
   FILTER PANEL
========================================================= */

function FilterPanel({
  maxPrice,
  setMaxPrice,
  selectedSizes,
  toggleSize,
  clearFilters,
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">

      {/* Header */}

      <div className="flex items-center justify-between">

        <h2 className="font-bold text-[#24151d]">
          Filters
        </h2>

        <button
          type="button"
          onClick={clearFilters}
          className="text-xs font-semibold text-[#c76b8b] hover:underline"
        >
          Clear all
        </button>

      </div>

      <div className="my-6 border-t border-gray-100" />

      {/* =====================================================
          PRICE
      ====================================================== */}

      <div>

        <h3 className="text-sm font-bold text-gray-900">
          Price
        </h3>

        <div className="mt-4">

          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={maxPrice}
            onChange={(event) =>
              setMaxPrice(
                Number(event.target.value)
              )
            }
            className="w-full accent-[#c76b8b]"
          />

          <div className="mt-2 flex justify-between text-xs text-gray-500">

            <span>₹100</span>

            <span className="font-semibold text-gray-900">
              Up to ₹
              {maxPrice.toLocaleString('en-IN')}
            </span>

          </div>

        </div>

      </div>

      <div className="my-6 border-t border-gray-100" />

      {/* =====================================================
          SIZE
      ====================================================== */}

      <div>

        <h3 className="text-sm font-bold text-gray-900">
          Size
        </h3>

        <div className="mt-4 grid grid-cols-3 gap-2">

          {sizes.map((size) => {

            const active =
              selectedSizes.includes(size)

            return (
              <button
                key={size}
                type="button"
                onClick={() =>
                  toggleSize(size)
                }
                className={`rounded-lg border py-2.5 text-xs font-semibold transition ${
                  active
                    ? 'border-[#24151d] bg-[#24151d] text-white'
                    : 'border-gray-200 text-gray-600 hover:border-[#c76b8b] hover:text-[#c76b8b]'
                }`}
              >
                {size}
              </button>
            )
          })}

        </div>

      </div>

      <div className="my-6 border-t border-gray-100" />

      {/* =====================================================
          SHOPPING BENEFITS
      ====================================================== */}

      <div>

        <h3 className="text-sm font-bold text-gray-900">
          Shopping benefits
        </h3>

        <div className="mt-4 space-y-3">

          <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">

            <input
              type="checkbox"
              className="h-4 w-4 accent-[#c76b8b]"
            />

            Free delivery

          </label>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">

            <input
              type="checkbox"
              className="h-4 w-4 accent-[#c76b8b]"
            />

            Easy returns

          </label>

          <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">

            <input
              type="checkbox"
              className="h-4 w-4 accent-[#c76b8b]"
            />

            New arrivals

          </label>

        </div>

      </div>

    </div>
  )
}

export default Products