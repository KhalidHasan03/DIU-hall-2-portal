import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  useEffect(() => {
    Promise.all([
      api.get('/admin/roles'),
      api.get('/admin/permissions'),
    ]).then(([r, p]) => {
      setRoles(r.data);
      setPermissions(p.data);
    }).finally(() => setLoading(false));
  }, []);

  const selectRole = (role: any) => {
    setSelectedRole(role);
    setSelectedPerms(role.permissions?.map((p: any) => p.name) || []);
  };

  const togglePerm = (perm: string) => {
    setSelectedPerms(prev => prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]);
  };

  const savePermissions = async () => {
    try {
      await api.put(`/admin/roles/${selectedRole.id}`, { permissions: selectedPerms });
      toast.success('Permissions updated!');
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-900 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-indigo-300 text-xs md:text-sm font-medium uppercase tracking-wider">Access Control</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Roles & Permissions</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm md:text-base font-semibold text-slate-800 mb-4">Roles</h2>
          <div className="space-y-2">
            {roles.map((role) => (
              <button key={role.id} onClick={() => selectRole(role)} className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                selectedRole?.id === role.id ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md' : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}>
                {role.name.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm md:text-base font-semibold text-slate-800 mb-4">
            {selectedRole ? (
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block" />
                {selectedRole.name.replace('_', ' ')} Permissions
              </span>
            ) : 'Select a role to manage permissions'}
          </h2>
          {selectedRole ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-6">
                {permissions.map((perm: any) => (
                  <label key={perm.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer text-sm text-slate-700 transition-colors">
                    <input type="checkbox" checked={selectedPerms.includes(perm.name)} onChange={() => togglePerm(perm.name)} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                    {perm.name.replace(/_/g, ' ')}
                  </label>
                ))}
              </div>
              <button onClick={savePermissions} className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-md">Save Permissions</button>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <span className="text-4xl block mb-3">🔐</span>
              <p className="text-sm">Click a role to manage its permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}