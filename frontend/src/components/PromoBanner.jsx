import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function PromoBanner() {
  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[1400px]">

        <div className="relative overflow-hidden rounded-3xl bg-[#24151d]">

          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-[#9d526e] to-transparent opacity-60" />

          <div className="relative grid items-center md:grid-cols-2">

            <div className="px-7 py-12 sm:px-12 sm:py-16">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#f3c3d1]">
                Limited time
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
                The Big
                <br />
                Fashion Edit
              </h2>

              <p className="mt-4 max-w-md text-gray-300">
                Refresh your wardrobe with styles you'll want to wear
                again and again.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-5">

                <div>
                  <p className="text-3xl font-black text-white">
                    UP TO 70%
                  </p>

                  <p className="text-sm text-gray-400">
                    OFF
                  </p>
                </div>

                <Link
                  to="/products"
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#24151d]"
                >
                  Shop Sale
                  <ArrowRight size={16} />
                </Link>

              </div>

            </div>

            <div className="hidden h-[320px] md:block">

              <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85"
                alt="Fashion sale"
                className="h-full w-full object-cover"
              />

            </div>

          </div>

        </div>

      </div>

    </section>
  )
}

export default PromoBanner