import { Link } from 'react-router-dom'

const categories = [
  {
    name: 'Dresses',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Sarees',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Kurtis',
    image:
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Western Wear',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Handbags',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Jewellery',
    image:
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Footwear',
    image:
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80',
  },
  {
    name: 'Beauty',
    image:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80',
  },
]

function CategorySection() {
  return (
    <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">

      <div className="mx-auto max-w-[1400px]">

        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c76b8b]">
            Explore
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#24151d] sm:text-4xl">
            Shop by category
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            Find something that feels exactly like you.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">

          {categories.map((category) => (
            <Link
              key={category.name}
              to="/products"
              className="group text-center"
            >
              <div className="mx-auto aspect-square max-w-[145px] overflow-hidden rounded-full bg-[#f7ecef]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-800 transition group-hover:text-[#c76b8b]">
                {category.name}
              </p>
            </Link>
          ))}

        </div>

      </div>

    </section>
  )
}

export default CategorySection