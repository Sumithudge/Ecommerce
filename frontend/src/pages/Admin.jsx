import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { BarChart3, Boxes, LogOut, Package, ShoppingCart, Users } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { getAdminDashboard, getAdminOrders, getAdminProducts, updateAdminOrder, getAdminUsers, createAdminProduct, updateAdminProduct, deleteAdminProduct } from '../services/api.js'

export default function Admin() {
  const { user, logout } = useAuth()
  const [data, setData] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [tab, setTab] = useState('overview')
  const [editing, setEditing] = useState(null)
  const load = async () => {
    const results = await Promise.all([getAdminDashboard(), getAdminOrders(), getAdminProducts(), getAdminUsers()])
    setData(results[0]); setOrders(results[1]); setProducts(results[2]); setUsers(results[3])
  }
  useEffect(() => { if (user?.role === 'admin') load().catch(console.error) }, [user])
  if (!user) return <Navigate to="/login" state={{ from: '/admin' }} replace />
  if (user.role !== 'admin') return <Navigate to="/account" replace />
  const cards = [['Revenue', '₹' + Number(data?.revenue || 0).toLocaleString('en-IN'), BarChart3], ['Orders', data?.orders || 0, ShoppingCart], ['Products', data?.products || 0, Boxes], ['Customers', data?.users || 0, Users]]
  return <div className="min-h-screen bg-[#f6f7f9]">
    <header className="sticky top-0 z-30 border-b bg-white"><div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4"><Link to="/" className="text-2xl font-black text-[#24151d]">Shobhaya Cloth <span className="text-xs font-semibold text-gray-400">ADMIN</span></Link><div className="flex items-center gap-3"><span className="hidden text-sm text-gray-500 sm:block">{user.name}</span><button onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold hover:bg-gray-100"><LogOut size={16}/>Sign out</button></div></div></header>
    <div className="mx-auto flex max-w-[1500px]">
      <aside className="hidden min-h-[calc(100vh-4rem)] w-60 border-r bg-white p-4 lg:block">{[['overview','Overview',BarChart3],['products','Products',Boxes],['orders','Orders',Package],['users','Customers',Users]].map(([id,label,Icon])=><button key={id} onClick={()=>setTab(id)} className={'mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold '+(tab===id?'bg-[#24151d] text-white':'text-gray-600 hover:bg-gray-50')}><Icon size={18}/>{label}</button>)}</aside>
      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">      <div className="mb-5 flex gap-2 overflow-x-auto lg:hidden">
        {[['overview','Overview',BarChart3],['products','Products',Boxes],['orders','Orders',Package],['users','Customers',Users]].map(([id,label,Icon]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ' + (tab === id ? 'bg-[#24151d] text-white' : 'bg-white text-gray-600 ring-1 ring-gray-200')}
          >
            <Icon size={16} />{label}
          </button>
        ))}
      </div>
        <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c76b8b]">Control center</p><h1 className="mt-1 text-3xl font-black text-[#24151d]">{tab === 'overview' ? 'Store overview' : tab === 'products' ? 'Product catalog' : tab === 'orders' ? 'Order management' : 'Customer management'}</h1></div>
        {tab === 'overview' && <><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map(([label,value,Icon])=><div key={label} className="rounded-2xl bg-white p-5 ring-1 ring-gray-100"><Icon className="text-[#c76b8b]"/><p className="mt-5 text-sm text-gray-500">{label}</p><p className="mt-1 text-2xl font-black">{value}</p></div>)}</div><div className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-gray-100"><h2 className="font-black">Latest orders</h2>{orders.slice(0,6).map(o=><div key={o._id} className="flex items-center justify-between border-b py-4 last:border-0"><div><b>#{o._id.slice(-8).toUpperCase()}</b><p className="text-xs text-gray-500">{o.user?.name} · {o.user?.email}</p></div><span className="font-bold">₹{o.total.toLocaleString('en-IN')}</span></div>)}</div></>}
        {tab === 'products' && <ProductTable products={products} reload={load} onEdit={setEditing} />}{editing && <ProductEditor product={editing} close={()=>setEditing(null)} reload={load} />}
        {tab === 'orders' && <OrderTable orders={orders} reload={load} />}
        {tab === 'users' && <UserTable users={users} />}
      </main>
    </div>
  </div>
}

function ProductTable({ products, reload, onEdit }) { return <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100"><div className="flex items-center justify-between border-b p-5"><div><b>{products.length} products</b><p className="mt-1 text-xs text-gray-500">Manage catalog pricing and inventory.</p></div><button onClick={()=>onEdit({name:'',category:'Dresses',description:'',image:'',price:0,originalPrice:0,discount:0,rating:0,reviews:0,sizes:['S','M','L'],colors:[],newArrival:true,stock:0,isActive:true})} className="rounded-xl bg-[#24151d] px-4 py-2 text-sm font-bold text-white">+ Add product</button></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Actions</th></tr></thead><tbody>{products.map(p=><tr key={p._id} className="border-t"><td className="flex items-center gap-3 p-4"><img src={p.image} className="h-12 w-10 rounded object-cover"/><div><span className="font-semibold">{p.name}</span><p className="text-xs text-gray-400">{p.category}</p></div></td><td className="p-4 font-semibold">₹{p.price.toLocaleString('en-IN')}</td><td className="p-4">{p.stock}</td><td className="p-4"><div className="flex gap-2"><button onClick={()=>onEdit(p)} className="rounded-lg border px-3 py-2 text-xs font-semibold">Edit</button><button onClick={async()=>{await deleteAdminProduct(p._id);await reload()}} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600">Archive</button></div></td></tr>)}</tbody></table></div></div> }

function OrderTable({ orders, reload }) { const statuses=['placed','confirmed','packed','shipped','delivered','cancelled']; const [busy,setBusy]=useState(''); return <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-4">Order</th><th className="p-4">Customer</th><th className="p-4">Total</th><th className="p-4">Status</th></tr></thead><tbody>{orders.map(o=><tr key={o._id} className="border-t"><td className="p-4 font-bold">#{o._id.slice(-8).toUpperCase()}</td><td className="p-4">{o.user?.name}<br/><span className="text-xs text-gray-400">{o.user?.email}</span></td><td className="p-4 font-semibold">₹{o.total.toLocaleString('en-IN')}</td><td className="p-4"><select disabled={busy===o._id} value={o.status} onChange={async e=>{setBusy(o._id);await updateAdminOrder(o._id,e.target.value);await reload();setBusy('')}} className="rounded-lg border px-3 py-2 text-xs">{statuses.map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div></div> }

function UserTable({ users }) { return <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-gray-100"><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-gray-50"><tr><th className="p-4">Customer</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Joined</th></tr></thead><tbody>{users.map(u=><tr key={u._id} className="border-t"><td className="p-4 font-semibold">{u.name}</td><td className="p-4">{u.email}</td><td className="p-4">{u.phone || '—'}</td><td className="p-4">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td></tr>)}</tbody></table></div></div> }


function ProductEditor({ product, close, reload }) {
  const [form,setForm]=useState(product)
  const [busy,setBusy]=useState(false)
  const update=(e)=>setForm({...form,[e.target.name]:e.target.value})
  async function save(e){e.preventDefault();setBusy(true);try{const payload={...form,price:Number(form.price),originalPrice:Number(form.originalPrice||0),discount:Number(form.discount||0),stock:Number(form.stock||0),rating:Number(form.rating||0),reviews:Number(form.reviews||0)};if(product._id) await updateAdminProduct(product._id,payload);else await createAdminProduct(payload);close();await reload()}finally{setBusy(false)}}
  return <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 p-4"><div className="mx-auto mt-8 max-w-2xl rounded-3xl bg-white p-6 shadow-xl"><div className="flex justify-between"><div><h2 className="text-xl font-black">{product._id?'Edit product':'Add product'}</h2><p className="text-sm text-gray-500">Catalog information and inventory.</p></div><button onClick={close} className="text-gray-500">✕</button></div><form onSubmit={save} className="mt-6 grid gap-4 sm:grid-cols-2">{[['name','Name'],['image','Image URL'],['price','Price'],['originalPrice','Original price'],['discount','Discount %'],['stock','Stock'],['rating','Rating'],['reviews','Reviews']].map(([name,label])=><label key={name} className="text-sm font-semibold">{label}<input name={name} value={form[name] ?? ''} onChange={update} required={['name','image','price'].includes(name)} className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 font-normal"/></label>)}<label className="text-sm font-semibold">Category<select name="category" value={form.category ?? 'Dresses'} onChange={update} required className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 font-normal"><option value="Dresses">Dresses</option><option value="Kurtis">Kurtis</option><option value="Sarees">Sarees</option><option value="Western Wear">Western Wear</option><option value="Ethnic Wear">Ethnic Wear</option><option value="Tops">Tops</option><option value="Footwear">Footwear</option><option value="Handbags">Handbags</option><option value="Jewellery">Jewellery</option><option value="Beauty">Beauty</option></select><span className="mt-1 block text-xs font-normal text-gray-400">This decides which category page/filter shows the product.</span></label><label className="sm:col-span-2 text-sm font-semibold">Description<textarea name="description" value={form.description||''} onChange={update} rows="3" className="mt-2 w-full rounded-xl border border-gray-200 px-3 py-2.5 font-normal"/></label><div className="sm:col-span-2 flex justify-end gap-3"><button type="button" onClick={close} className="rounded-xl border px-5 py-3 font-semibold">Cancel</button><button disabled={busy} className="rounded-xl bg-[#24151d] px-5 py-3 font-bold text-white">{busy?'Saving…':'Save product'}</button></div></form></div></div>
}