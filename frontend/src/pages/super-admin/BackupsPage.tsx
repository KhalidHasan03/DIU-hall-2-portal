import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminBackupsPage() {
  const [backups, setBackups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchBackups = () => {
    setLoading(true);
    api.get('/admin/backups').then(({ data }) => setBackups(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchBackups(); }, []);

  const createBackup = async () => {
    setCreating(true);
    try {
      await api.post('/admin/backups/create');
      toast.success('Backup created');
      fetchBackups();
    } catch { toast.error('Failed'); }
    setCreating(false);
  };

  const deleteBackup = async (id: number) => {
    if (!confirm('Delete this backup?')) return;
    try {
      await api.delete(`/admin/backups/${id}`);
      toast.success('Deleted');
      fetchBackups();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Maintenance</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Backups</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Create and manage database backups.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={createBackup} disabled={creating} className="px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl text-sm font-medium shadow-md disabled:opacity-50">
          {creating ? 'Creating...' : '+ Create Backup'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {backups.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-3">💾</span>
            <p className="text-slate-400 font-medium">No backups yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Filename</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Size</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Created</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {backups.map((b: any) => (
                  <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{b.filename}</td>
                    <td className="px-4 py-3.5 text-slate-500">{(b.size / 1024).toFixed(1)} KB</td>
                    <td className="px-4 py-3.5 text-slate-500">{new Date(b.created_at).toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => deleteBackup(b.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button>
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