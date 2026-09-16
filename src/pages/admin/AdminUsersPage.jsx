import { useState, useMemo } from 'react'
import {
  Search,
  Shield,
  UserCheck,
  UserX,
  Sparkles,
} from 'lucide-react'
import { MOCK_USERS_LIST } from '../../data/authDemo'
import { useToast } from '../../context/useToast'

export default function AdminUsersPage() {
  const [userList, setUserList] = useState(MOCK_USERS_LIST)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const { success } = useToast()

  const filteredUsers = useMemo(() => {
    return userList.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRole = roleFilter === 'All' || u.role === roleFilter.toLowerCase()
      return matchesSearch && matchesRole
    })
  }, [userList, searchQuery, roleFilter])

  const toggleUserStatus = (userId) => {
    setUserList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'Active' ? 'Suspended' : 'Active'
          success(`User "${u.name}" status changed to ${newStatus}.`)
          return { ...u, status: newStatus }
        }
        return u
      })
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">User Management</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            Monitor registered gamers, manage access roles, and moderate user account statuses.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-800 border border-surface-700 text-xs text-gray-300">
          <Sparkles className="w-3.5 h-3.5 text-primary-400" />
          <span>Total Registered: <strong>{userList.length}</strong></span>
        </div>
      </div>

      {/* Filter bar */}
      <div className="p-4 rounded-2xl bg-surface-850 border border-surface-700/60 shadow-lg flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-surface-900 border border-surface-700 rounded-xl text-sm text-gray-200 focus:outline-none focus:border-primary-500 cursor-pointer"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Administrators</option>
          <option value="User">Regular Users</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-surface-850 border border-surface-700/60 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-700/60 bg-surface-900/60 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Joined Date</th>
                <th className="py-3.5 px-6">Downloads</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-700/40 text-sm">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-surface-800/60 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-9 h-9 rounded-xl object-cover border border-surface-700 shrink-0"
                      />
                      <div>
                        <p className="font-semibold text-white">{u.name}</p>
                        <p className="text-[11px] text-gray-400">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-6 font-mono text-xs text-gray-300">
                    {u.email}
                  </td>

                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-primary-500/15 text-primary-300 border border-primary-500/30'
                          : 'bg-surface-750 text-gray-300 border border-surface-700'
                      }`}
                    >
                      {u.role === 'admin' && <Shield className="w-3 h-3" />}
                      {u.role === 'admin' ? 'Administrator' : 'Gamer'}
                    </span>
                  </td>

                  <td className="py-3.5 px-6 text-xs text-gray-400">
                    {u.joinedDate}
                  </td>

                  <td className="py-3.5 px-6 text-xs font-semibold text-gray-300">
                    {u.downloadsCount || 0} games
                  </td>

                  <td className="py-3.5 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        u.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-6 text-right">
                    {u.role !== 'admin' ? (
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          u.status === 'Active'
                            ? 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 border border-rose-500/20'
                            : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-500/20'
                        }`}
                        title={u.status === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                      >
                        {u.status === 'Active' ? (
                          <>
                            <UserX className="w-3.5 h-3.5" /> Suspend
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3.5 h-3.5" /> Activate
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500 italic pr-2">Protected</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
