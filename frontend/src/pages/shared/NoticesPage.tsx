import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', target_role: 'all' });
  const user = useAuthStore((s) => s.user);
  const canCreate = user && ['super_admin', 'hall_tutor', 'manager'].includes(user.role);

  const fetchNotices = () => {
    setLoading(true);
    api.get('/notices').then(({ data }) => setNotices(data.data || data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchNotices(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const rolePrefix = user?.role === 'super_admin' ? 'admin' : user?.role === 'hall_tutor' ? 'hall-tutor' : 'manager';
      await api.post(`/${rolePrefix}/notices`, form);
      toast.success('Notice published!');
      setShowForm(false);
      setForm({ title: '', content: '', target_role: 'all' });
      fetchNotices();
    } catch { toast.error('Failed to publish'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Announcements</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Notices</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Stay updated with hall announcements.</p>
        </div>
      </div>

      {canCreate && (
        <div className="flex justify-end">
          <button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-amber-200">
            {showForm ? 'Cancel' : '+ New Notice'}
          </button>
        </div>
      )}

      {showForm && canCreate && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Title</label>
              <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Target</label>
              <select value={form.target_role} onChange={e => setForm({...form, target_role: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 outline-none">
                <option value="all">All</option>
                <option value="student">Students</option>
                <option value="manager">Managers</option>
                <option value="hall_tutor">Hall Tutors</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Content</label>
            <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 outline-none" rows={4} required />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium shadow-md">Publish Notice</button>
        </form>
      )}

      <div className="space-y-3 md:space-y-4">
        {notices.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-200">
            <span className="text-4xl block mb-3">📢</span>
            <p className="text-slate-400 font-medium">No notices yet</p>
          </div>
        ) : (
          notices.map((n: any) => (
            <div key={n.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-500/20 flex items-center justify-center text-lg md:text-xl shrink-0">📢</div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-800 text-sm md:text-base">{n.title}</h3>
                    <span className="text-[10px] md:text-xs text-slate-400 whitespace-nowrap">{new Date(n.created_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 mt-2 leading-relaxed">{n.content}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 capitalize">{n.target_role}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}