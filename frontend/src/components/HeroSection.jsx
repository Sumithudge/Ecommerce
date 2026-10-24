import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f8e9ed]">

      <div className="mx-auto grid min-h-[500px] max-w-[1500px] items-center lg:grid-cols-2">

        {/* Text */}
        <div className="relative z-10 px-6 py-16 sm:px-10 lg:px-16 lg:py-20">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9d526e]">
            <Sparkles size={14} />
            New Season Collection
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-[1.02] tracking-[-2px] text-[#24151d] sm:text-6xl lg:text-7xl">
            Your style.
            <br />
            Your
            <span className="text-[#c76b8b]">
              {' '}story.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600 sm:text-lg">
            Discover effortless fashion made for every version of you.
            From everyday essentials to statement pieces.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">

            <Link
              to="/products"
              className="group flex items-center gap-3 rounded-full bg-[#24151d] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#3b222e]"
            >
              Shop Collection

              <ArrowRight
                size={17}
                className="transition group-hover:translate-x-1"
              />
            </Link>

            <Link
              to="/products"
              className="rounded-full border border-[#24151d] bg-white/60 px-7 py-4 text-sm font-semibold text-[#24151d] transition hover:bg-white"
            >
              Explore New Arrivals
            </Link>

          </div>

          <div className="mt-10 flex gap-8">

            <div>
              <p className="text-xl font-bold text-[#24151d]">
                10K+
              </p>

              <p className="text-xs text-gray-500">
                Happy shoppers
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-[#24151d]">
                4.8/5
              </p>

              <p className="text-xs text-gray-500">
                Customer rating
              </p>
            </div>

            <div>
              <p className="text-xl font-bold text-[#24151d]">
                24/7
              </p>

              <p className="text-xs text-gray-500">
                Support
              </p>
            </div>

          </div>

        </div>

        {/* Fashion visual */}
        <div className="relative min-h-[420px] lg:h-full">

          <div className="absolute right-[-100px] top-[-50px] h-[450px] w-[450px] rounded-full bg-[#e8bdc9]" />

          <div className="absolute bottom-0 right-[5%] h-[440px] w-[70%] overflow-hidden rounded-t-[180px] bg-gradient-to-b from-[#d59aaa] to-[#8f5269]">

            <img
              src="https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85"
              alt="Women's fashion collection"
              className="h-full w-full object-cover object-top mix-blend-multiply"
            />

          </div>

          <div className="absolute bottom-10 left-8 rounded-2xl bg-white/90 px-5 py-4 shadow-xl backdrop-blur sm:left-16">

            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Trending now
            </p>

            <p className="mt-1 font-bold text-[#24151d]">
              Spring Edit '26
            </p>

          </div>

        </div>

      </div>

    </section>
  )
}

export default HeroSection