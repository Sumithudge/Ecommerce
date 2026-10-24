import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, Filter, Search, SlidersHorizontal, X } from 'lucide-react'
import { getProducts } from '../services/api.js'
import Navbar from '../components/Navbar.jsx'
import ProductCard from '../components/ProductCard.jsx'

const categories = ['All', 'New Arrivals', 'Dresses', 'Kurtis', 'Sarees', 'Western Wear', 'Ethnic Wear', 'Tops', 'Footwear', 'Handbags', 'Jewellery', 'Beauty', 'Sale']
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'All'
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('popular')
  const [maxPrice, setMaxPrice] = useState(5000)
  const [selectedSizes, setSelectedSizes] = useState([])
  const [mobileFilters, setMobileFilters] = useState(false)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getProducts()
      .then(data => { if (active) setProducts(Array.isArray(data) ? data : []) })
      .catch(() => { if (active) setError('Unable to load products right now.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const filteredProducts = useMemo(() => {
    let result = [...products]
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Sale') {
        result = result.filter(p => Number(p.discount || 0) > 0 || Number(p.originalPrice || 0) > Number(p.price || 0))
      } else if (selectedCategory === 'New Arrivals') {
        result = result.filter(p => p.newArrival === true || p.badge === 'New')
      } else {
        result = result.filter(p => String(p.category || '').toLowerCase() === selectedCategory.toLowerCase())
      }
    }

    const query = search.trim().toLowerCase()
    if (query) {
      result = result.filter(p =>
        String(p.name || p.title || '').toLowerCase().includes(query) ||
        String(p.category || '').toLowerCase().includes(query) ||
        String(p.description || '').toLowerCase().includes(query)
      )
    }

    result = result.filter(p => Number(p.price || 0) <= maxPrice)
    if (selectedSizes.length) {
      result = result.filter(p => {
        const productSizes = Array.isArray(p.sizes) ? p.sizes : []
        return selectedSizes.some(size => productSizes.includes(size))
      })
    }

    if (sort === 'low') result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0))
    if (sort === 'high') result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
    if (sort === 'discount') result.sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0))
    return result
  }, [products, selectedCategory, search, maxPrice, selectedSizes, sort])

  const clearFilters = () => {
    setSearch('')
    setMaxPrice(5000)
    setSelectedSizes([])
    setSort('popular')
    setSearchParams({})
  }

  const toggleSize = size => setSelectedSizes(current => current.includes(size) ? current.filter(item => item !== size) : [...current, size])
  const changeCategory = category => category === 'All' ? setSearchParams({}) : setSearchParams({ category })

  return (
    <div className="min-h-screen bg-[#fcfafb]">
      <Navbar />
      <main>
        <section className="border-b border-gray-100 bg-white">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-4 py-7 sm:px-6 sm:py-8 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#c76b8b]">Women's Collection</p>
              <h1 className="mt-2 break-words text-3xl font-black tracking-tight text-[#24151d] sm:text-4xl">{selectedCategory === 'All' ? "Women's Fashion" : selectedCategory}</h1>
              <p className="mt-2 max-w-xl text-sm text-gray-500">Discover styles made for every mood, moment and occasion.</p>
            </div>
            <div className="text-sm text-gray-500"><span className="font-semibold text-gray-900">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'product' : 'products'}</div>
          </div>
        </section>

        <div className="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          <div className="flex flex-col gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-gray-100 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dresses, kurtis, sarees, handbags..." className="h-11 w-full rounded-full border border-gray-200 bg-[#faf9fa] pl-11 pr-5 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#c76b8b] focus:bg-white" />
            </div>
            <div className="flex w-full gap-2 lg:w-auto">
              <button type="button" onClick={() => setMobileFilters(true)} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 text-sm font-medium lg:hidden"><SlidersHorizontal size={17} /> Filters</button>
              <div className="relative w-full sm:w-auto">
                <select value={sort} onChange={e => setSort(e.target.value)} className="h-11 w-full appearance-none rounded-full border border-gray-200 bg-white py-0 pl-4 pr-11 text-sm font-medium outline-none focus:border-[#c76b8b] sm:min-w-[190px]">
                  <option value="popular">Sort: Popular</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="discount">Biggest Discount</option>
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <FilterPanel selectedCategory={selectedCategory} changeCategory={changeCategory} maxPrice={maxPrice} setMaxPrice={setMaxPrice} selectedSizes={selectedSizes} toggleSize={toggleSize} clearFilters={clearFilters} />
            </aside>

            <section className="min-w-0">
              {loading ? (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white ring-1 ring-gray-100" />)}</div>
              ) : error ? (
                <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-gray-100"><h2 className="text-xl font-bold text-[#24151d]">Products are temporarily unavailable</h2><p className="mt-2 text-sm text-gray-500">{error}</p></div>
              ) : filteredProducts.length ? (
                <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-4 xl:grid-cols-4">{filteredProducts.map(product => <ProductCard key={product._id || product.id} product={product} />)}</div>
              ) : (
                <div className="flex min-h-[360px] flex-col items-center justify-center rounded-3xl bg-white px-6 text-center ring-1 ring-gray-100">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f8e8ed]"><Search size={25} className="text-[#c76b8b]" /></div>
                  <h2 className="mt-5 text-xl font-bold text-[#24151d]">No products found</h2>
                  <p className="mt-2 max-w-sm text-sm text-gray-500">Try changing your search or filters to discover more products.</p>
                  <button type="button" onClick={clearFilters} className="mt-6 rounded-full bg-[#24151d] px-6 py-3 text-sm font-semibold text-white">Clear filters</button>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      {mobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[88vh] overflow-y-auto rounded-t-3xl bg-white p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2"><Filter size={19} /><h2 className="font-bold text-[#24151d]">Filters</h2></div><button type="button" onClick={() => setMobileFilters(false)} className="rounded-full bg-gray-100 p-2" aria-label="Close filters"><X size={18} /></button></div>
            <FilterPanel selectedCategory={selectedCategory} changeCategory={changeCategory} maxPrice={maxPrice} setMaxPrice={setMaxPrice} selectedSizes={selectedSizes} toggleSize={toggleSize} clearFilters={clearFilters} />
            <button type="button" onClick={() => setMobileFilters(false)} className="mt-6 w-full rounded-full bg-[#24151d] py-4 text-sm font-bold text-white">Show {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}</button>
          </div>
        </div>
      )}
    </div>
  )
}

function FilterPanel({ selectedCategory, changeCategory, maxPrice, setMaxPrice, selectedSizes, toggleSize, clearFilters }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-center justify-between"><h2 className="font-bold text-[#24151d]">Filters</h2><button type="button" onClick={clearFilters} className="text-xs font-semibold text-[#c76b8b] hover:underline">Clear all</button></div>
      <div className="my-5 border-t border-gray-100" />

      <label className="block text-sm font-bold text-gray-900">Category
        <select value={selectedCategory} onChange={e => changeCategory(e.target.value)} className="mt-3 h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium outline-none focus:border-[#c76b8b]">
          {categories.map(category => <option key={category} value={category}>{category}</option>)}
        </select>
      </label>

      <div className="my-6 border-t border-gray-100" />
      <div><h3 className="text-sm font-bold text-gray-900">Price</h3><input type="range" min="100" max="5000" step="100" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} className="mt-4 w-full accent-[#c76b8b]" /><div className="mt-2 flex justify-between text-xs text-gray-500"><span>₹100</span><span className="font-semibold text-gray-900">Up to ₹{maxPrice.toLocaleString('en-IN')}</span></div></div>

      <div className="my-6 border-t border-gray-100" />
      <div><h3 className="text-sm font-bold text-gray-900">Size</h3><div className="mt-4 grid grid-cols-3 gap-2">
        {sizes.map(size => { const active = selectedSizes.includes(size); return <button key={size} type="button" onClick={() => toggleSize(size)} className={`rounded-lg border py-2.5 text-xs font-semibold transition ${active ? 'border-[#24151d] bg-[#24151d] text-white' : 'border-gray-200 text-gray-600 hover:border-[#c76b8b] hover:text-[#c76b8b]'}`}>{size}</button> })}
      </div></div>

    </div>
  )
}
