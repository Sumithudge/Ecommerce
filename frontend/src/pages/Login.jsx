import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : (location.state?.from || '/account')} replace />

  async function submit(e) {
    e.preventDefault(); setError(''); setBusy(true)
    try { const u = await login({ email, password }); navigate(u.role === 'admin' ? '/admin' : (location.state?.from || '/account'), { replace: true }) }
    catch (err) { setError(err.message) } finally { setBusy(false) }
  }

  return <AuthLayout title="Welcome back" subtitle="Sign in to continue shopping with Elora.">
    <form onSubmit={submit} className="space-y-4">
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <button disabled={busy} className="w-full rounded-xl bg-[#24151d] py-3.5 font-bold text-white disabled:opacity-50">{busy ? 'Signing in…' : 'Sign In'}</button>
    </form>
    <p className="mt-6 text-center text-sm text-gray-500">New to Elora? <Link to="/register" className="font-bold text-[#c76b8b]">Create account</Link></p>
  </AuthLayout>
}

function AuthLayout({ title, subtitle, children }) {
  return <div className="min-h-screen bg-[#fcfafb] px-4 py-10"><div className="mx-auto max-w-md"><Link to="/" className="mb-8 flex justify-center text-3xl font-black text-[#24151d]">Elo<span className="text-[#c76b8b]">ra</span></Link><div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-gray-100 sm:p-9"><div className="mb-7 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#fff0f4] text-[#c76b8b]"><ShoppingBag size={21}/></div><h1 className="mt-4 text-2xl font-black text-[#24151d]">{title}</h1><p className="mt-2 text-sm text-gray-500">{subtitle}</p></div>{children}</div></div></div>
}

function Field({ label, type, value, onChange, placeholder }) {
  return <label className="block text-sm font-medium text-gray-700">{label}<input required type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#c76b8b]"/></label>
}
