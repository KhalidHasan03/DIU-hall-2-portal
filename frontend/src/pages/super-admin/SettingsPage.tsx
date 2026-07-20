import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/settings').then(({ data }) => setSettings(data)).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      const allSettings = Object.values(settings).flat().map((s: any) => ({ key: s.key, value: s.value }));
      await api.put('/admin/settings', { settings: allSettings });
      toast.success('Settings saved');
    } catch { toast.error('Failed to save'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Configuration</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">System Settings</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        {Object.entries(settings).map(([group, items]) => (
          <div key={group} className="mb-6 last:mb-0">
            <h3 className="font-semibold capitalize mb-3 text-slate-700 text-sm md:text-base border-b border-slate-100 pb-2">{group}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(items as any[]).map((item: any) => (
                <div key={item.key}>
                  <label className="block text-xs font-medium text-slate-600 mb-1 capitalize">{item.key?.replace(/_/g, ' ')}</label>
                  <input
                    type={item.type === 'integer' ? 'number' : 'text'}
                    value={item.value}
                    onChange={e => {
                      const newSettings = { ...settings };
                      const idx = (newSettings[group] as any[]).findIndex((s: any) => s.key === item.key);
                      newSettings[group][idx].value = e.target.value;
                      setSettings(newSettings);
                    }}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        <button onClick={handleSave} className="px-6 py-2.5 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl text-sm font-medium shadow-md">Save Settings</button>
      </div>
    </div>
  );
}