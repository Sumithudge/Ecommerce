const API_URL = `${(import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '')}/api`

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  const data = await response.json()

  return data
}

export const getProductById = async (id) => {
  const response = await fetch(`${API_URL}/products/${id}`)

  if (!response.ok) {
    throw new Error('Failed to fetch product')
  }

  const data = await response.json()

  return data
}
const authHeaders = (token = localStorage.getItem('elora-token')) => token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' }

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { ...options, headers: { ...authHeaders(options.token), ...(options.headers || {}) } })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const registerUser = (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) })
export const loginUser = (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) })
export const getMe = (token) => request('/auth/me', { token })
export const getMyOrders = () => request('/orders')
export const createOrder = (payload) => request('/orders', { method: 'POST', body: JSON.stringify(payload) })
export const getAdminDashboard = () => request('/admin/dashboard')
export const getAdminProducts = () => request('/admin/products')
export const createAdminProduct = (payload) => request('/admin/products', { method: 'POST', body: JSON.stringify(payload) })
export const updateAdminProduct = (id, payload) => request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) })
export const deleteAdminProduct = (id) => request(`/admin/products/${id}`, { method: 'DELETE' })
export const getAdminOrders = () => request('/admin/orders')
export const updateAdminOrder = (id, status) => request(`/admin/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const getAdminUsers = () => request('/admin/users')

export const getWishlist = () => request('/store/wishlist')
export const toggleWishlist = (productId) => request(`/store/wishlist/${productId}`, { method: 'POST' })
export const getAddresses = () => request('/store/addresses')
export const addAddress = (payload) => request('/store/addresses', { method: 'POST', body: JSON.stringify(payload) })
export const deleteAddress = (id) => request(`/store/addresses/${id}`, { method: 'DELETE' })
export const getReviews = (productId) => request(`/store/reviews/${productId}`)
export const createReview = (productId, payload) => request(`/store/reviews/${productId}`, { method: 'POST', body: JSON.stringify(payload) })
export const applyCoupon = (code, subtotal) => request('/store/coupons/apply', { method: 'POST', body: JSON.stringify({ code, subtotal }) })
