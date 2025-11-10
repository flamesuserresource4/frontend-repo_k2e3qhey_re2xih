import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('cs_user')
    if (u) setUser(JSON.parse(u))
  }, [])

  function logout() {
    localStorage.removeItem('cs_user')
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-emerald-600" />
          <span className="text-lg font-bold text-emerald-700">Campus</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/dashboard" className="text-gray-700 hover:text-emerald-700">Dashboard</Link>
          {!user && (
            <>
              <Link to="/login" className="text-gray-700 hover:text-emerald-700">Login</Link>
              <Link to="/register" className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-1.5 font-medium text-white hover:bg-emerald-700">Sign up</Link>
            </>
          )}
          {user && (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
                {user.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <button onClick={logout} className="text-gray-700 hover:text-emerald-700">Logout</button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}
