import { useState } from 'react'

const API_URL = import.meta.env.VITE_BACKEND_URL || ''

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Registration failed')
      const data = await res.json()
      localStorage.setItem('cs_user', JSON.stringify(data))
      window.location.href = '/dashboard'
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-b from-emerald-50 to-white">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow border border-emerald-100">
        <h1 className="text-2xl font-bold text-emerald-800 mb-1">Create your account</h1>
        <p className="text-sm text-gray-600 mb-6">Join the campus community</p>
        {error && <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>}
        <form onSubmit={onSubmit} className="grid gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="Your name" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="you@school.edu" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="********" required />
          </div>
          <button disabled={loading} className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
