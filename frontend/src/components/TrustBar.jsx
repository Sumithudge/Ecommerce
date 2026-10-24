import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
} from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'Reliable Delivery',
    text: 'Fast and transparent delivery',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    text: 'Simple return experience',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Payments',
    text: 'Your payments are protected',
  },
  {
    icon: Headphones,
    title: 'Customer Support',
    text: 'We are here when you need us',
  },
]

function TrustBar() {
  return (
    <section className="border-y border-gray-100 bg-[#fffafb]">

      <div className="mx-auto grid max-w-[1400px] grid-cols-2 lg:grid-cols-4">

        {features.map((feature) => {
          const Icon = feature.icon

          return (
            <div
              key={feature.title}
              className="flex items-center gap-4 border-gray-100 px-5 py-6 lg:border-r"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f7e5ea] text-[#b45d7b]">
                <Icon size={21} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#24151d]">
                  {feature.title}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {feature.text}
                </p>
              </div>
            </div>
          )
        })}

      </div>

    </section>
  )
}

export default TrustBar