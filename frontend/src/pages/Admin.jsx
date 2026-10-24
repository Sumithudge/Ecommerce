import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { BarChart3, Boxes, LogOut, Package, ShoppingCart, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getAdminDashboard, getAdminOrders, getAdminProducts, updateAdminOrder, getAdminUsers } from '../services/api.js'

export default function Admin() {
  const { user, logout } = useAuth()
  const [data, setData] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('overview')
  const load = async () => {
    const results = await Promise.all([getAdminDashboard(), getAdminOrders(), getAdminProducts(), getAdminUsers()])
    setData(results[0]); setOrders(results[1]); setProducts(results[2]); setUsers(results[3])
  }
  useEffect(() => { if (user?.role === 'admin') load().catch(console.error) }, [user])
  if (!user) return <Navigate to="/login" state={{ from: '/admin' }} replace />
  if (user.role !== 'admin') return <Navigate to="/account" replace />
  const cards = [['Revenue', '₹' + Number(data?.revenue || 0).toLocaleString('en-IN'), BarChart3], ['Orders', data?.orders || 0, ShoppingCart], ['Products', data?.products || 0, Boxes], ['Customers', data?.users || 0, Users]]
  return <div className="min-h-screen bg-[#f6f7f9]">
    <header className="sticky top-0 z-30 border-b bg-white"><div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4"><Link to="/" className="text-2xl font-black text-[#24151d]">Elora <span className="text-xs font-semibold text-gray-400">ADMIN</span></Link><div className="flex items-center gap-3"><span className="hidden text-sm text-gray-500 sm:block">{user.name}</span><button onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-gray-100"><LogOut size={16}/>Sign out</button></div></div></header>
    <div className="mx-auto flex max-w-[1500px]">
      <aside className="hidden min-h-[calc(100vh-4rem)] w-60 border-r bg-white p-4 lg:block">{[['overview','Overview',BarChart3],['products','Products',Boxes],['orders','Orders',Package],['users','Customers',Users]].map(([id,label,Icon])=><button key={id} onClick={()=>setTab(id)} className={'mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold '+(tab===id?'bg-[#24151d] text-white':'text-gray-600 hover:bg-gray-50')}><Icon size={18}/>{label}</button>)}</aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8"><div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c76b8b]">Control center</p><h1 className="mt-1 text-3xl font-black text-[#24151d]">{tab === 'overview' ? 'Store overview' : tab === 'products' ? 'Product catalog' : tab === 'orders' ? 'Order management' : 'Customer management'}</h1></div>
        {tab === 'overview' && <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value,Icon])=><div key={label} className="rounded-2xl bg-white p-5 ring-1 ring-gray-100"><Icon className="text-[#c76b8b]"/><p className="mt-5 text-sm text-gray-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>)}</div><div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-gray-100"><h2 className="font-black">Latest orders</h2>{orders.slice(0,6).map(o=><div key={o._id} className="flex items-center justify-between border-b py-4 last:border-0"><div><b>#{o._id.slice(-8).toUpperCase()}</b><p className="text-xs text-gray-500">{o.user?.name} · {o.user?.email}</p></div><span className="font-bold">₹{o.total.toLocaleString('en-IN')}</span></div>)}</div></>}
        {tab === 'products' && <ProductTable products={products} />}
        {tab === 'orders' && <OrderTable orders={orders} reload={load} />}
        {tab === 'users' && <UserTable users={users} />}
      </main>
    </div>
  </div>
}

function ProductTable({ products }) { return <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100"><div className="border-b p-5"><b>{products.length} products</b><p className="mt-1 text-xs text-gray-500">Inventory and catalog overview. Product creation UI is the next catalog phase.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-4">Product</th><th className="p-4">Category</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Status</th></tr></thead><tbody>{products.map(p=><tr key={p._id} className="border-t"><td className="flex items-center gap-3 p-4"><img src={p.image} className="h-12 w-10 rounded object-cover"/><span className="font-semibold">{p.name}</span></td><td className="p-4">{p.category}</td><td className="p-4 font-semibold">₹{p.price.toLocaleString('en-IN')}</td><td className="p-4">{p.stock}</td><td className="p-4"><span className={p.stock < 5 ? 'text-red-600' : 'text-green-600'}>{p.stock < 5 ? 'Low stock' : 'In stock'}</span></td></tr>)}</tbody></table></div></div> }

function OrderTable({ orders, reload }) { const statuses=['placed','confirmed','packed','shipped','delivered','cancelled']; const [busy,setBusy]=useState(''); return <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Status</th></tr></thead><tbody>{orders.map(o=><tr key={o._id} className="border-t"><td className="p-4 font-bold">#{o._id.slice(-8).toUpperCase()}</td><td className="p-4">{o.user?.name}<br/><span className="text-xs text-gray-400">{o.user?.email}</span></td><td className="p-4 font-semibold">₹{o.total.toLocaleString('en-IN')}</td><td className="p-4"><select disabled={busy===o._id} value={o.status} onChange={async e=>{setBusy(o._id);await updateAdminOrder(o._id,e.target.value);await reload();setBusy('')}} className="rounded-lg border px-3 py-2 text-xs">{statuses.map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div></div> }

function UserTable({ users }) { return <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-4">Customer</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Joined</th></tr></thead><tbody>{users.map(u=><tr key={u._id} className="border-t"><td className="p-4 font-semibold">{u.name}</td><td className="p-4">{u.email}</td><td className="p-4">{u.phone || '—'}</td><td className="p-4">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></div></div> }
