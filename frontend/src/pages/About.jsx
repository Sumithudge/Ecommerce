import Navbar from '../components/Navbar.jsx'
function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
            About Us
          </p>

          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
            Shopping should be simple, trustworthy and enjoyable.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            We are building a modern shopping experience where customers
            can discover quality products, get transparent pricing and
            enjoy reliable delivery.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">

        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Our Story
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Built for a better way to shop
            </h2>

            <p className="mt-6 leading-8 text-gray-600">
              Our goal is to create an e-commerce platform that combines
              great products, competitive pricing and a smooth customer
              experience.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              From discovering products to checkout and delivery, every
              part of the experience is designed with the customer in mind.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-2xl bg-gray-100 p-8">
              <p className="text-3xl font-bold text-gray-900">100%</p>
              <p className="mt-2 text-sm text-gray-500">
                Customer focused
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 p-8">
              <p className="text-3xl font-bold text-gray-900">24/7</p>
              <p className="mt-2 text-sm text-gray-500">
                Online shopping
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 p-8">
              <p className="text-3xl font-bold text-gray-900">
                Secure
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Payments
              </p>
            </div>

            <div className="rounded-2xl bg-gray-100 p-8">
              <p className="text-3xl font-bold text-gray-900">
                Easy
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Shopping experience
              </p>
            </div>

          </div>

        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50 px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              Everything you need for better shopping
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <Feature
              icon="🚚"
              title="Reliable Delivery"
              text="Clear delivery pricing and a convenient shopping experience."
            />

            <Feature
              icon="🔒"
              title="Secure Payments"
              text="Payments are designed with security and customer trust in mind."
            />

            <Feature
              icon="↩"
              title="Easy Experience"
              text="From product discovery to checkout, everything stays simple."
            />

          </div>

        </div>

      </section>

    </div>
  )
}

function Feature({ icon, title, text }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
      <div className="text-3xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-500">
        {text}
      </p>
    </div>
  )
}

export default About