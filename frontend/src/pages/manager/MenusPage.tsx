import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManagerMenusPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], meal_type: 'lunch', menu_text: '' });

  const fetchMenus = () => {
    setLoading(true);
    api.get('/manager/menus').then(({ data }) => setMenus(data.data || data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchMenus(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/manager/menus', form);
      toast.success('Menu added!');
      setShowForm(false);
      setForm({ date: new Date().toISOString().split('T')[0], meal_type: 'lunch', menu_text: '' });
      fetchMenus();
    } catch { toast.error('Failed to add menu'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this menu?')) return;
    try {
      await api.delete(`/manager/menus/${id}`);
      toast.success('Menu deleted');
      fetchMenus();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const grouped = menus.reduce((acc: any, m: any) => {
    if (!acc[m.date]) acc[m.date] = [];
    acc[m.date].push(m);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Meal Management</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Daily Menus</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Set and manage daily lunch & dinner menus.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-orange-200 hover:shadow-xl transition-all">
          {showForm ? 'Cancel' : '+ Add Menu'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Meal Type</label>
              <select value={form.meal_type} onChange={e => setForm({...form, meal_type: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none">
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Menu Items</label>
              <input type="text" value={form.menu_text} onChange={e => setForm({...form, menu_text: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none" placeholder="e.g. Rice, Chicken Curry, Dal" required />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl text-sm font-medium shadow-md">Save Menu</button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base">Menu Schedule</h2>
        </div>
        {menus.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-3">🍽️</span>
            <p className="text-slate-400 font-medium">No menus added yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {Object.entries(grouped).map(([date, dayMenus]: [string, any]) => (
              <div key={date} className="p-4 md:p-6">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {new Date(date).toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(dayMenus as any[]).map((m: any) => (
                    <div key={m.id} className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-orange-50/50 transition-colors border border-slate-100">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${
                          m.meal_type === 'lunch' ? 'bg-gradient-to-br from-orange-400/20 to-orange-500/20' : 'bg-gradient-to-br from-indigo-400/20 to-indigo-500/20'
                        }`}>
                          {m.meal_type === 'lunch' ? '☀️' : '🌙'}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-700 capitalize">{m.meal_type}</p>
                          <p className="text-xs text-slate-500 truncate">{m.menu_text}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(m.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 text-xs font-medium transition-opacity shrink-0">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}