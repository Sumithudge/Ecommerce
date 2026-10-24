import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect, useState } from 'react'
import { getMyOrders } from '../services/api.js'

export default function Account() {
  const { user, logout } = useAuth()
  const [orders,setOrders]=useState([])
  useEffect(()=>{ if(user) getMyOrders().then(setOrders).catch(()=>{}) },[user])
  if(!user) return null
  return <div className="min-h-screen bg-[#fcfafb]"><Navbar/><main className="mx-auto max-w-6xl px-4 py-8 sm:px-6"><div className="rounded-3xl bg-[#24151d] p-7 text-white sm:p-10"><p className="text-sm text-white/60">My Elora account</p><h1 className="mt-2 text-3xl font-black">Hi, {user.name.split(' ')[0]} 👋</h1><p className="mt-2 text-sm text-white/70">{user.email}</p></div><div className="mt-7 grid gap-5 md:grid-cols-3"><Link to="/products" className="rounded-2xl bg-white p-6 ring-1 ring-gray-100 hover:shadow-sm"><b>Shop products</b><p className="mt-2 text-sm text-gray-500">Discover new styles and offers.</p></Link><div className="rounded-2xl bg-white p-6 ring-1 ring-gray-100"><b>My orders</b><p className="mt-2 text-2xl font-black">{orders.length}</p></div><button onClick={logout} className="rounded-2xl bg-white p-6 text-left ring-1 ring-gray-100 hover:text-red-600"><b>Sign out</b><p className="mt-2 text-sm text-gray-500">Securely sign out of this device.</p></button></div><section className="mt-8 rounded-2xl bg-white p-6 ring-1 ring-gray-100"><div className="flex items-center justify-between"><h2 className="text-xl font-black">Recent orders</h2><span className="text-sm text-gray-400">{orders.length} total</span></div><div className="mt-5 divide-y">{orders.slice(0,5).map(order=><div key={order._id} className="flex items-center justify-between py-4"><div><p className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p><p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')} · {order.items.length} items</p></div><div className="text-right"><p className="font-bold">₹{order.total.toLocaleString('en-IN')}</p><p className="text-xs font-semibold capitalize text-[#c76b8b]">{order.status}</p></div></div>)}</div>{orders.length===0&&<p className="py-8 text-center text-sm text-gray-500">Your orders will appear here.</p>}</section></main></div>
}
