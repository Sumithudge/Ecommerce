import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useCart } from '../context/CartContext.jsx'

function Cart() {
  const {
    cartItems,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="text-6xl">🛒</div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-600">
            Add some products to your cart to get started.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-block rounded-lg bg-black px-6 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">

        <h1 className="text-4xl font-bold text-gray-900">
          Shopping Cart
        </h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* Items */}
          <div className="space-y-4">

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-5 rounded-xl bg-white p-5 ring-1 ring-gray-200"
              >
                <img
                  src={`${item.image}?auto=format&fit=crop&w=300&q=80`}
                  alt={item.name}
                  className="h-28 w-28 rounded-lg object-cover"
                />

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        {item.category}
                      </p>

                      <h2 className="mt-1 font-semibold text-gray-900">
                        {item.name}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-gray-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center rounded-lg border border-gray-300">
                      <button
                        type="button"
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                        className="px-3 py-1.5"
                      >
                        −
                      </button>

                      <span className="px-3 py-1.5 text-sm">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                        className="px-3 py-1.5"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-bold">
                      ₹
                      {(
                        item.price * item.quantity
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            ))}

          </div>

          {/* Summary */}
          <aside className="h-fit rounded-xl bg-white p-6 ring-1 ring-gray-200">

            <h2 className="text-xl font-bold">
              Order Summary
            </h2>

            <div className="mt-6 flex justify-between text-gray-600">
              <span>Subtotal</span>

              <span>
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="mt-3 flex justify-between text-gray-600">
              <span>Shipping</span>

              <span>{cartTotal >= 1500 ? 'FREE' : '₹80'}</span>
            </div>

            <div className="my-6 border-t border-gray-200" />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>

              <span>
                ₹{cartTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <Link
                   to="/checkout"
                   className="mt-6 block w-full rounded-lg bg-black py-3 text-center font-semibold text-white hover:bg-gray-800">
                   Proceed to Checkout
           </Link>

          </aside>

        </div>
      </main>
    </div>
  )
}

export default Cart