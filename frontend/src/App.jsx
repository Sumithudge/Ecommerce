import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home.jsx'
import Products from './pages/products.jsx'
import ProductDetails from './pages/ProductDetails.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Navbar from './components/Navbar.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Account from './pages/Account.jsx'
import Admin from './pages/Admin.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'

function Payment() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-3xl px-6 py-20 text-center">
        <div className="rounded-2xl bg-white p-10 shadow-sm ring-1 ring-gray-200">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
            ₹
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Payment
          </h1>

          <p className="mt-3 text-gray-500">
            Choose your preferred payment method.
          </p>

          <div className="mt-8 rounded-xl bg-gray-50 p-5 text-left">
            <p className="text-sm font-semibold text-gray-900">
              Secure Payment
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Your payment will be securely processed.
            </p>
          </div>

        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Products */}
        <Route
          path="/products"
          element={<Products />}
        />

        {/* Product Details */}
        <Route
          path="/products/:id"
          element={<ProductDetails />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/admin" element={<Admin />} />

        {/* Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* Payment */}
        <Route
          path="/payment"
          element={<Payment />}
        />
        <Route
         path="/about"
         element={<About />}
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App