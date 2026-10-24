import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createOrder, applyCoupon, getAddresses } from '../services/api.js'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName:'', lastName:'', phone:'', email:user?.email || '', address:'', city:'', state:'', pincode:'' })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [couponMessage, setCouponMessage] = useState('')
  const [savedAddresses, setSavedAddresses] = useState([])

  const shipping = cartTotal >= 1500 ? 0 : 80
  const discount = Math.max(couponDiscount, cartTotal >= 3000 ? 500 : 0)
  const total = Math.max(0, cartTotal + shipping - discount)
  const update = e => setForm({ ...form, [e.target.name]: e.target.value })

  useEffect(() => { if (user) getAddresses().then(setSavedAddresses).catch(() => {}) }, [user])
  async function useCoupon(){try{const r=await applyCoupon(couponCode,cartTotal);setCouponDiscount(r.discount);setCouponMessage(`Saved ₹${r.discount.toLocaleString('en-IN')}`)}catch(e){setCouponDiscount(0);setCouponMessage(e.message)}}

  async function submit(e) {
    e.preventDefault()
    if (!user) { navigate('/login', { state:{ from:'/checkout' } }); return }
    setError('')
    setBusy(true)
    try {
      const order = await createOrder({
        items: cartItems.map(item => ({ productId: item._id || item.id, quantity: item.quantity, selectedSize: item.selectedSize || '' })),
        shippingAddress: form,
        paymentMethod,
        discount,
      })
      clearCart()
      navigate('/order-success', { state:{ order } })
    } catch (err) {
      setError(err.message)
    } finally { setBusy(false) }
  }

  if (!cartItems.length) return <div className="min-h-screen bg-[#fcfafb]"><Navbar/><main className="mx-auto max-w-xl px-6 py-24 text-center"><h1 className="text-3xl font-black">Your cart is empty</h1><Link to="/products" className="mt-7 inline-block rounded-xl bg-[#24151d] px-6 py-3 font-bold text-white">Continue Shopping</Link></main></div>

  return <div className="min-h-screen bg-[#f6f7f9]"><Navbar/><div className="border-b bg-white"><div className="mx-auto max-w-7xl px-4 py-6"><h1 className="text-2xl font-black text-[#24151d]">Secure Checkout</h1><p className="mt-1 text-sm text-gray-500">Delivery, payment and confirmation</p></div></div>
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-100"><h2 className="text-lg font-black">Delivery address</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{[['firstName','First name'],['lastName','Last name'],['phone','Mobile number'],['email','Email']].map(([name,label])=><label key={name} className="text-sm font-medium">{label}<input required name={name} value={form[name]} onChange={update} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c76b8b]"/></label>)}</div><label className="mt-4 block text-sm font-medium">Address<textarea required name="address" value={form.address} onChange={update} rows="3" className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c76b8b]"/></label><div className="mt-4 grid gap-4 sm:grid-cols-3">{[['city','City'],['state','State'],['pincode','PIN code']].map(([name,label])=><label key={name} className="text-sm font-medium">{label}<input required name={name} value={form[name]} onChange={update} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c76b8b]"/></label>)}</div></section>
        {savedAddresses.length > 0 && <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-100"><h2 className="text-lg font-black">Saved addresses</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{savedAddresses.map(a=><button type="button" key={a._id} onClick={()=>setForm({...form,...a})} className="rounded-xl border p-4 text-left text-sm hover:border-[#c76b8b]"><b>{a.label||'Address'}</b><p className="mt-1 text-gray-500">{a.address}, {a.city}, {a.state} - {a.pincode}</p></button>)}</div></section>}
        <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-100"><h2 className="text-lg font-black">Payment method</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><label className={`cursor-pointer rounded-xl border p-4 ${paymentMethod==='cod'?'border-[#24151d] bg-[#faf7f8]':'border-gray-200'}`}><input type="radio" checked={paymentMethod==='cod'} onChange={()=>setPaymentMethod('cod')} className="mr-2"/>Cash on Delivery</label><label className={`cursor-pointer rounded-xl border p-4 ${paymentMethod==='online'?'border-[#24151d] bg-[#faf7f8]':'border-gray-200'}`}><input type="radio" checked={paymentMethod==='online'} onChange={()=>setPaymentMethod('online')} className="mr-2"/>Online payment</label></div><p className="mt-3 text-xs text-gray-500">Online payment is prepared in the order system; connect your gateway before accepting real payments.</p></section>
        <section className="rounded-2xl bg-white p-6 ring-1 ring-gray-100"><h2 className="text-lg font-black">Coupon</h2><div className="mt-3 flex gap-2"><input value={couponCode} onChange={e=>setCouponCode(e.target.value.toUpperCase())} placeholder="Enter coupon code" className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm"/><button type="button" onClick={useCoupon} className="rounded-xl bg-[#24151d] px-4 py-3 text-sm font-bold text-white">Apply</button></div>{couponMessage&&<p className="mt-2 text-xs font-semibold text-green-600">{couponMessage}</p>}</section>
        {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      </div>
      <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-gray-100 lg:sticky lg:top-24"><h2 className="text-lg font-black">Order summary</h2><div className="mt-5 max-h-72 space-y-4 overflow-auto">{cartItems.map(item=><div key={item._id||item.id} className="flex gap-3"><img src={item.image} className="h-16 w-14 rounded-lg object-cover"/><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.name}</p><p className="text-xs text-gray-500">Qty {item.quantity}</p></div><b className="text-sm">₹{(item.price*item.quantity).toLocaleString('en-IN')}</b></div>)}</div><div className="mt-5 space-y-2 border-t pt-5 text-sm"><div className="flex justify-between"><span>Subtotal</span><b>₹{cartTotal.toLocaleString('en-IN')}</b></div><div className="flex justify-between"><span>Delivery</span><b>{shipping?'₹'+shipping:'FREE'}</b></div>{discount>0&&<div className="flex justify-between text-green-600"><span>Discount</span><b>-₹{discount}</b></div>}<div className="flex justify-between border-t pt-4 text-xl font-black"><span>Total</span><span>₹{total.toLocaleString('en-IN')}</span></div></div><button disabled={busy} className="mt-6 w-full rounded-xl bg-[#24151d] py-4 font-bold text-white disabled:opacity-50">{busy?'Placing order…':'Place Order'}</button></aside>
    </form></main></div>
}