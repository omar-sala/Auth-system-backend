import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout, refreshUser } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [deletePassword, setDeletePassword] = useState('')
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    setName(user?.name || '')
  }, [user])

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await api.patch('/auth/profile', {
        name,
      })

      setMessage(response.data.message)
      await refreshUser()
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    setMessage('')
    setError('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await api.patch('/auth/change-password', {
        currentPassword,
        newPassword,
      })

      setMessage(response.data.message)

      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const deleteAccount = async () => {
    setMessage('')
    setError('')

    try {
      await api.delete('/auth/account', {
        data: {
          password: deletePassword,
        },
      })

      await logout()
      navigate('/login')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete account')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="mt-1 text-slate-400">Manage your account settings</p>
        </div>

        {(message || error) && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              message
                ? 'border border-green-900/50 bg-green-950/40 text-green-300'
                : 'border border-red-900/50 bg-red-950/40 text-red-300'
            }`}
          >
            {message || error}
          </div>
        )}

        {/* Profile Information */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-xl font-semibold">Profile Information</h2>

          <form onSubmit={updateProfile} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm text-slate-300">Name</label>

              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm text-slate-300">Email</label>

              <input
                value={user?.email || ''}
                disabled
                className="w-full cursor-not-allowed rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-500"
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-5 text-xl font-semibold">Change Password</h2>

          <form onSubmit={changePassword} className="space-y-5">
            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              minLength={6}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={6}
              required
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 outline-none focus:border-blue-500"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-60"
            >
              Change Password
            </button>
          </form>
        </section>

        {/* Account */}
        <section className="rounded-xl border border-red-900/40 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-red-400">Danger Zone</h2>

          <p className="mt-2 text-sm text-slate-400">
            Deleting your account is permanent and cannot be undone.
          </p>

          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="mt-5 rounded-lg bg-red-600 px-5 py-3 font-semibold hover:bg-red-500"
            >
              Delete Account
            </button>
          ) : (
            <div className="mt-5 space-y-4">
              <input
                type="password"
                placeholder="Enter your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full rounded-lg border border-red-900 bg-slate-950 px-4 py-3 outline-none focus:border-red-500"
              />

              <div className="flex gap-3">
                <button
                  onClick={deleteAccount}
                  className="rounded-lg bg-red-600 px-5 py-3 font-semibold hover:bg-red-500"
                >
                  Confirm Delete
                </button>

                <button
                  onClick={() => setShowDelete(false)}
                  className="rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-800"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>

        <button
          onClick={handleLogout}
          className="w-full rounded-lg border border-slate-700 px-5 py-3 font-semibold hover:bg-slate-900"
        >
          Logout
        </button>
      </div>
    </main>
  )
}
