/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const CartContext = createContext(null)

function getInitialCart() {
  try {
    const savedCart = localStorage.getItem('ecommerce-cart')

    if (!savedCart) {
      return []
    }

    return JSON.parse(savedCart)
  } catch (error) {
    console.error('Failed to load cart:', error)
    return []
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(getInitialCart)

  useEffect(() => {
    localStorage.setItem(
      'ecommerce-cart',
      JSON.stringify(cartItems)
    )
  }, [cartItems])

  function addToCart(product) {
    setCartItems((currentItems) => {
      const productId = product._id || product.id
      const existingItem = currentItems.find(
        (item) => (item._id || item.id) === productId
      )

      if (existingItem) {
        return currentItems.map((item) =>
          (item._id || item.id) === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      }

      return [
        ...currentItems,
        {
          ...product,
          quantity: 1,
        },
      ]
    })
  }

  function removeFromCart(productId) {
    setCartItems((currentItems) => currentItems.filter(item => (item._id || item.id) !== productId))
  }

  function increaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        (item._id || item.id) === productId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    )
  }

  function decreaseQuantity(productId) {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          (item._id || item.id) === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  function clearCart() {
    setCartItems([])
  }

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    )
  }, [cartItems])

  const cartTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    )
  }, [cartItems])

  const value = {
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    )
  }

  return context
}