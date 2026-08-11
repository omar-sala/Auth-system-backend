import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'
import type { LoginData } from '../types/auth'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { refreshUser } = useAuth()

  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  })

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')

    try {
      await api.post('/auth/login', formData)
      await refreshUser()
      navigate('/profile')
    } catch {
      setMessage('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center">
        <div className="w-full rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>

            <p className="mt-2 text-sm text-slate-400">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-200"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-200"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-400 transition hover:text-blue-300"
                >
                  Forgot password?
                </Link>
              </div>

              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-700" />

            <span className="text-sm text-slate-500">OR</span>

            <div className="h-px flex-1 bg-slate-700" />
          </div>

          <a
            href={`${import.meta.env.VITE_API_URL}/auth/google`}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 font-semibold text-white transition hover:bg-slate-700"
          >
            Continue with Google
          </a>

          {message && (
            <p className="mt-5 rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-center text-sm text-red-300">
              {message}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
