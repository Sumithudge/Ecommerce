import { useEffect, useState } from 'react'
import { createAdminBanner, deleteAdminBanner, getAdminBanners, updateAdminBanner } from '../services/api.js'

const emptyBanner = {
  badge: 'New Season Collection',
  title: 'Your style.',
  highlight: 'Your story.',
  description: 'Discover effortless fashion made for every version of you.',
  image: '',
  buttonText: 'Shop Collection',
  buttonLink: '/products',
  secondaryButtonText: 'Explore New Arrivals',
  secondaryButtonLink: '/products',
  trendingLabel: 'Trending now',
  trendingText: "Spring Edit '26",
  order: 0,
  isActive: true,
}

export default function BannerManager() {
  const [banners, setBanners] = useState([])
  const [form, setForm] = useState(emptyBanner)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = async () => setBanners(await getAdminBanners())

  useEffect(() => { load().catch(console.error) }, [])

  const update = e => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  const edit = banner => {
    setEditing(banner._id)
    setForm({ ...emptyBanner, ...banner })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const reset = () => {
    setEditing(null)
    setForm(emptyBanner)
  }

  const save = async e => {
    e.preventDefault()
    setBusy(true)
    try {
      const payload = { ...form, order: Number(form.order || 0) }
      if (editing) await updateAdminBanner(editing, payload)
      else await createAdminBanner(payload)
      reset()
      await load()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
      <div className="rounded-2xl bg-white p-5 ring-1 ring-gray-100">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-black">{editing ? 'Edit hero banner' : 'Add hero banner'}</h2>
            <p className="mt-1 text-xs text-gray-500">The storefront rotates active banners automatically.</p>
          </div>
          {editing && <button onClick={reset} className="text-sm font-semibold text-gray-500">Cancel</button>}
        </div>

        <form onSubmit={save} className="grid gap-3 sm:grid-cols-2">
          {[
            ['badge', 'Badge'],
            ['title', 'Title'],
            ['highlight', 'Highlighted text'],
            ['image', 'Image URL'],
            ['buttonText', 'Primary button'],
            ['buttonLink', 'Primary link'],
            ['secondaryButtonText', 'Secondary button'],
            ['secondaryButtonLink', 'Secondary link'],
            ['trendingLabel', 'Trending label'],
            ['trendingText', 'Trending text'],
            ['order', 'Display order'],
          ].map(([name, label]) => (
            <label key={name} className="text-sm font-semibold">
              {label}
              <input
                name={name}
                value={form[name] ?? ''}
                onChange={update}
                required={['title', 'image'].includes(name)}
                className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 font-normal"
              />
            </label>
          ))}

          <label className="sm:col-span-2 text-sm font-semibold">
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={update}
              rows="3"
              className="mt-1.5 w-full rounded-xl border border-gray-200 px-3 py-2.5 font-normal"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={update} />
            Show this banner on the storefront
          </label>

          <button disabled={busy} className="rounded-xl bg-[#24151d] px-5 py-3 font-bold text-white sm:col-span-2">
            {busy ? 'Saving…' : editing ? 'Update banner' : 'Add banner'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {banners.map(banner => (
          <div key={banner._id} className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100">
            <div className="grid grid-cols-[110px_1fr]">
              <img src={banner.image} alt="" className="h-full min-h-28 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#c76b8b]">{banner.badge}</p>
                    <h3 className="mt-1 font-black">{banner.title} {banner.highlight}</h3>
                    <p className="mt-1 text-xs text-gray-500">Order {banner.order} · {banner.isActive ? 'Active' : 'Hidden'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => edit(banner)} className="rounded-lg border px-3 py-2 text-xs font-semibold">Edit</button>
                    <button onClick={async () => { await deleteAdminBanner(banner._id); await load() }} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
