import Navbar from '../components/Navbar'
import Spline from '@splinetool/react-spline'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-6 py-16 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              Connect your campus
            </h1>
            <p className="mt-4 text-lg text-gray-700">
              Groups for classes, clubs, and communities. Share updates, comment, and like. Moderated to keep things positive.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/register" className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700">Get started</Link>
              <Link to="/login" className="inline-flex items-center rounded-lg bg-white px-5 py-3 font-semibold text-emerald-700 shadow border border-emerald-100">Sign in</Link>
            </div>
          </div>
          <div className="h-[360px] rounded-2xl border border-emerald-100 bg-white shadow">
            <Spline scene="https://prod.spline.design/ezRAY9QD27kiJcur/scene.splinecode" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </section>
    </div>
  )
}
