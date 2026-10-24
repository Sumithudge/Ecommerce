import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect, useState } from 'react'
import { getMyOrders, getAddresses, addAddress, deleteAddress } from '../services/api.js'

export default function Account() {
  const { user, logout } = useAuth()
  const [orders,setOrders]=useState([])
  const [addresses,setAddresses]=useState([])
  const [showAddress,setShowAddress]=useState(false)
  const [form,setForm]=useState({label:'Home',firstName:'',lastName:'',phone:'',address:'',city:'',state:'',pincode:''})
  useEffect(()=>{if(user){getMyOrders().then(setOrders).catch(()=>{});getAddresses().then(setAddresses).catch(()=>{})}},[user])
  if(!user)return null
  async function saveAddress(e){e.preventDefault();const a=await addAddress(form);setAddresses([...addresses,a]);setShowAddress(false);setForm({label:'Home',firstName:'',lastName:'',phone:'',address:'',city:'',state:'',pincode:''})}
  return <div className="min-h-screen bg-[#fcfafb]"><Navbar/><main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
    <div className="rounded-3xl bg-[#24151d] p-7 text-white sm:p-10"><p className="text-sm text-white/60">My Shobhaya Cloth account</p><h1 className="mt-2 text-3xl font-black">Hi, {user.name.split(' ')[0]} 👋</h1><p className="mt-2 text-sm text-white/70">{user.email}</p></div>
    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <Link to="/products" className="rounded-2xl bg-white p-6 ring-1 ring-gray-100"><b>Shop products</b><p className="mt-2 text-sm text-gray-500">Discover new styles.</p></Link>
      <Link to="/wishlist" className="rounded-2xl bg-white p-6 ring-1 ring-gray-100"><b>Wishlist</b><p className="mt-2 text-sm text-gray-500">Your saved favourites.</p></Link>
      <div className="rounded-2xl bg-white p-6 ring-1 ring-gray-100"><b>My orders</b><p className="mt-2 text-2xl font-black">{orders.length}</p></div>
      <button onClick={logout} className="rounded-2xl bg-white p-6 text-left ring-1 ring-gray-100 hover:text-red-600"><b>Sign out</b><p className="mt-2 text-sm text-gray-500">Securely sign out.</p></button>
    </div>
    <section className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-gray-100"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Saved addresses</h2><button onClick={()=>setShowAddress(!showAddress)} className="rounded-xl bg-[#24151d] px-4 py-2 text-sm font-bold text-white">{showAddress?'Cancel':'+ Add address'}</button></div>
      {showAddress&&<form onSubmit={saveAddress} className="mt-5 grid gap-3 sm:grid-cols-2">{[['label','Label'],['firstName','First name'],['lastName','Last name'],['phone','Phone'],['address','Address'],['city','City'],['state','State'],['pincode','PIN code']].map(([n,l])=><label key={n} className="text-sm font-semibold">{l}<input required={n!=='label'} name={n} value={form[n]} onChange={e=>setForm({...form,[n]:e.target.value})} className="mt-1 w-full rounded-xl border px-3 py-2.5 font-normal"/></label>)}<button className="sm:col-span-2 rounded-xl bg-[#24151d] py-3 font-bold text-white">Save address</button></form>}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">{addresses.map(a=><div key={a._id} className="rounded-xl border p-4"><div className="flex justify-between"><b>{a.label||'Address'}</b><button onClick={async()=>{const next=await deleteAddress(a._id);setAddresses(next)}} className="text-xs font-bold text-red-500">Remove</button></div><p className="mt-2 text-sm text-gray-600">{a.firstName} {a.lastName}<br/>{a.address}<br/>{a.city}, {a.state} - {a.pincode}<br/>{a.phone}</p></div>)}</div>
    </section>
    <section className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-gray-100"><div className="flex items-center justify-between"><h2 className="text-xl font-black">My orders</h2><span className="text-sm text-gray-400">{orders.length} total</span></div><div className="mt-5 divide-y">{orders.slice(0,10).map(o=><div key={o._id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-semibold">Order #{o._id.slice(-8).toUpperCase()}</p><p className="text-xs text-gray-500">{new Date(o.createdAt).toLocaleDateString('en-IN')} · {o.items.length} items · COD</p></div><div className="text-right"><p className="font-bold">₹{o.total.toLocaleString('en-IN')}</p><p className="text-xs font-semibold capitalize text-[#c76b8b]">{o.status}</p></div></div>)}</div>{orders.length===0&&<p className="py-8 text-center text-sm text-gray-500">Your orders will appear here.</p>}</section>
  </main></div>
}
