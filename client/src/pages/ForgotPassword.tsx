import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await api.post('/auth/forgot-password', {
        email,
      })

      setMessage(response.data.message)
    } catch (error: any) {
      setError(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Forgot Password</h1>

          <p className="mt-2 text-sm text-slate-400">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border border-slate-800 bg-slate-900 p-6"
        >
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          {message && (
            <p className="rounded-lg border border-green-900/50 bg-green-950/40 px-4 py-3 text-center text-sm text-green-300">
              {message}
            </p>
          )}

          {error && (
            <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-4 py-3 text-center text-sm text-red-300">
              {error}
            </p>
          )}

          <p className="text-center text-sm text-slate-400">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
