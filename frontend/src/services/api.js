const API_URL = 'http://localhost:5000/api'

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