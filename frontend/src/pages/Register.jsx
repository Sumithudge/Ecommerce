import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/account'} replace />
  const update = e => setForm({ ...form, [e.target.name]: e.target.value })
  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true)
    try { await register(form); navigate(location.state?.from || '/account', { replace: true }) } catch (err) { setError(err.message) } finally { setBusy(false) }
  }
  return <div className="min-h-screen bg-[#fcfafb] px-4 py-10"><div className="mx-auto max-w-md"><Link to="/" className="mb-8 block text-center text-3xl font-black text-[#24151d]">Elo<span className="text-[#c76b8b]">ra</span></Link><div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100 sm:p-9"><h1 className="text-2xl font-black text-[#24151d]">Create your account</h1><p className="mt-2 text-sm text-gray-500">Join Elora and manage your shopping in one place.</p><form onSubmit={submit} className="mt-7 space-y-4">{[['name','Full name','text'],['email','Email','email'],['phone','Mobile number','tel'],['password','Password','password']].map(([name,label,type])=><label key={name} className="block text-sm font-medium text-gray-700">{label}<input required={name!=='phone'} name={name} type={type} value={form[name]} onChange={update} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c76b8b]"/></label>)}{error&&<p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}<button disabled={busy} className="w-full rounded-xl bg-[#24151d] py-3.5 font-bold text-white disabled:opacity-50">{busy?'Creating…':'Create Account'}</button></form><p className="mt-6 text-center text-sm text-gray-500">Already have an account? <Link to="/login" className="font-bold text-[#c76b8b]">Sign in</Link></p></div></div></div>
}
