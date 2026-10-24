import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useCart } from '../context/CartContext.jsx'

function Checkout() {
  const navigate = useNavigate()

  const {
    cartItems,
    cartTotal,
  } = useCart()

  const [selectedAddress, setSelectedAddress] = useState('home')
  const [showAddressForm, setShowAddressForm] = useState(false)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  const [errors, setErrors] = useState({})

  const deliveryCharge = 0
  const discount = cartTotal >= 3000 ? 500 : 0
  const finalTotal = cartTotal + deliveryCharge - discount

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function validateAddress() {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Required'
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit number'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Required'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Required'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'Required'
    }

    if (!formData.state.trim()) {
      newErrors.state = 'Required'
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Enter a valid PIN'
    }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0
  }

  function handleContinue() {
    if (!validateAddress()) {
      setShowAddressForm(true)
      return
    }

    navigate('/payment')
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="mx-auto max-w-3xl px-6 py-24 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-sm ring-1 ring-gray-200">
            🛒
          </div>

          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            Your cart is empty
          </h1>

          <p className="mt-3 text-gray-500">
            Add some products before continuing to checkout.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex rounded-lg bg-black px-7 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9]">
      <Navbar />

      {/* Checkout Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Secure Checkout
            </h1>

            <p className="mt-1 text-xs text-gray-500">
              Complete your order securely
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>🔒</span>
            <span className="hidden sm:block">
              Secure & encrypted
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5">
          <div className="mx-auto flex max-w-2xl items-center justify-center">

            <Step number="1" label="Delivery" active />

            <div className="h-px flex-1 bg-gray-300" />

            <Step number="2" label="Payment" />

            <div className="h-px flex-1 bg-gray-300" />

            <Step number="3" label="Confirmation" />

          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* LEFT SIDE */}

          <div className="space-y-5">

            {/* Address */}
            <section className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">

              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Step 1
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-gray-900">
                    Delivery Address
                  </h2>
                </div>

                {!showAddressForm && (
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(true)}
                    className="text-sm font-semibold text-black hover:underline"
                  >
                    + Add New Address
                  </button>
                )}

              </div>

              <div className="p-6">

                {!showAddressForm ? (
                  <div className="grid gap-4 sm:grid-cols-2">

                    <AddressCard
                      selected={selectedAddress === 'home'}
                      onClick={() => setSelectedAddress('home')}
                      type="HOME"
                      name="Your Name"
                      phone="98765 XXXXX"
                      address="Your saved delivery address will appear here."
                    />

                    <button
                      type="button"
                      onClick={() => setShowAddressForm(true)}
                      className="flex min-h-[170px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-600 transition hover:border-black hover:text-black"
                    >
                      <span className="mr-2 text-xl">+</span>
                      Add New Address
                    </button>

                  </div>
                ) : (
                  <div>

                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Add Delivery Address
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          Enter the address where you want your order delivered.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="text-sm text-gray-500 hover:text-black"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        placeholder="John"
                      />

                      <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        placeholder="Doe"
                      />

                      <Input
                        label="Mobile Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={errors.phone}
                        placeholder="9876543210"
                        maxLength={10}
                      />

                      <Input
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="john@example.com"
                      />

                    </div>

                    <div className="mt-4">
                      <label className="text-sm font-medium text-gray-700">
                        Address
                      </label>

                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        rows={3}
                        placeholder="House number, street, area"
                        className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-black ${
                          errors.address
                            ? 'border-red-400'
                            : 'border-gray-300'
                        }`}
                      />

                      {errors.address && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">

                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        error={errors.city}
                        placeholder="Delhi"
                      />

                      <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        error={errors.state}
                        placeholder="Delhi"
                      />

                      <Input
                        label="PIN Code"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        error={errors.pincode}
                        placeholder="110001"
                        maxLength={6}
                      />

                    </div>

                  </div>
                )}

              </div>
            </section>

            {/* Delivery */}
            <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  🚚
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Delivery
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Free standard delivery
                  </p>

                  <p className="mt-2 text-sm font-medium text-gray-900">
                    Estimated delivery: 3–5 business days
                  </p>
                </div>

                <span className="ml-auto text-sm font-bold text-green-600">
                  FREE
                </span>
              </div>

            </section>

            {/* Payment Preview */}
            <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  💳
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">
                    Payment
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Secure payment options available on the next step.
                  </p>
                </div>

              </div>

            </section>

            {/* Trust */}
            <div className="grid gap-3 sm:grid-cols-3">

              <TrustItem
                icon="🔒"
                title="Secure Payment"
                text="Your payment is protected"
              />

              <TrustItem
                icon="↩️"
                title="Easy Returns"
                text="Simple return process"
              />

              <TrustItem
                icon="✓"
                title="Verified Order"
                text="Order tracking available"
              />

            </div>

          </div>

          {/* RIGHT SIDE */}

          <aside className="h-fit lg:sticky lg:top-24">

            <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200">

              <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-lg font-bold text-gray-900">
                  Order Summary
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {cartItems.length}{' '}
                  {cartItems.length === 1 ? 'item' : 'items'}
                </p>
              </div>

              <div className="max-h-[360px] space-y-5 overflow-y-auto p-6">

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4"
                  >
                    <div className="relative shrink-0">

                      <img
                        src={`${item.image}?auto=format&fit=crop&w=200&q=80`}
                        alt={item.name}
                        className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                      />

                      <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                        {item.quantity}
                      </span>

                    </div>

                    <div className="min-w-0 flex-1">

                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {item.category}
                      </p>

                      <p className="mt-2 font-semibold text-gray-900">
                        ₹
                        {(
                          item.price * item.quantity
                        ).toLocaleString('en-IN')}
                      </p>

                    </div>

                  </div>
                ))}

              </div>

              <div className="border-t border-gray-100 px-6 py-5">

                {/* Coupon */}
                <div className="mb-5 flex gap-2">

                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black"
                  />

                  <button
                    type="button"
                    className="rounded-lg border border-black px-4 text-sm font-semibold text-black hover:bg-black hover:text-white"
                  >
                    Apply
                  </button>

                </div>

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>

                    <span>
                      ₹{cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>

                    <span className="font-medium text-green-600">
                      200
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>

                      <span>
                        −₹{discount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                </div>

                <div className="my-5 border-t border-dashed border-gray-300" />

                <div className="flex items-end justify-between">

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {discount > 0 && (
                    <span className="text-xs font-semibold text-green-600">
                      You save ₹{discount.toLocaleString('en-IN')}
                    </span>
                  )}

                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-black py-4 font-semibold text-white transition hover:bg-gray-800 active:scale-[0.99]"
                >
                  Continue to Payment
                  <span>→</span>
                </button>

                <p className="mt-4 text-center text-xs text-gray-500">
                  🔒 Your payment information is encrypted and secure.
                </p>

              </div>

            </div>

          </aside>

        </div>
      </main>
    </div>
  )
}

function Step({ number, label, active = false }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
          active
            ? 'bg-black text-white'
            : 'bg-gray-200 text-gray-500'
        }`}
      >
        {number}
      </div>

      <span
        className={`hidden text-sm font-semibold sm:block ${
          active ? 'text-black' : 'text-gray-400'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

function AddressCard({
  selected,
  onClick,
  type,
  name,
  phone,
  address,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full rounded-xl border-2 p-5 text-left transition ${
        selected
          ? 'border-black bg-gray-50'
          : 'border-gray-200 hover:border-gray-400'
      }`}
    >
      {selected && (
        <span className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white">
          ✓
        </span>
      )}

      <div className="flex items-center gap-2">
        <span className="text-xs font-bold tracking-wider text-gray-500">
          {type}
        </span>
      </div>

      <h3 className="mt-3 font-bold text-gray-900">
        {name}
      </h3>

      <p className="mt-1 text-sm text-gray-600">
        {phone}
      </p>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {address}
      </p>
    </button>
  )
}

function Input({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  maxLength,
}) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`mt-2 w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-black ${
          error
            ? 'border-red-400'
            : 'border-gray-300'
        }`}
      />

      {error && (
        <p className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

function TrustItem({ icon, title, text }) {
  return (
    <div className="rounded-xl bg-white p-4 text-center ring-1 ring-gray-200">
      <div className="text-xl">{icon}</div>

      <p className="mt-2 text-sm font-semibold text-gray-900">
        {title}
      </p>

      <p className="mt-1 text-xs text-gray-500">
        {text}
      </p>
    </div>
  )
}

export default Checkout