import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    api.get('/admin/users').then(({ data }) => setUsers(data.data || data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleActive = async (id: number) => {
    try {
      await api.put(`/admin/users/${id}/toggle-active`);
      toast.success('User status toggled');
      fetchUsers();
    } catch { toast.error('Failed to toggle'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Administration</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Manage Users</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">View and manage all system users.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{user.name}</td>
                    <td className="px-4 py-3.5 text-slate-500">{user.email}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 capitalize">{user.role?.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <button onClick={() => toggleActive(user.id)} className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}