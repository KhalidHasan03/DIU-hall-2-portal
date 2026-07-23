import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

function MgStatCard({ title, value, sub, icon, gradient }: { title: string; value: string | number; sub?: string; icon: string; gradient: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-5 md:p-6 text-white ${gradient} shadow-lg`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-xs md:text-sm text-white/80 font-medium">{title}</p>
          <p className="text-xl md:text-2xl font-bold mt-1">{value}</p>
          {sub && <p className="text-xs text-white/60 mt-0.5">{sub}</p>}
        </div>
        <span className="text-2xl md:text-3xl">{icon}</span>
      </div>
    </div>
  );
}

function ManagerMealSettings(_props: { data: any }) {
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ lunch_cutoff_time: '', dinner_cutoff_time: '' });

  useEffect(() => {
    if (show) {
      api.get('/manager/settings/meal').then(({ data: s }) => {
        setForm({
          lunch_cutoff_time: s.lunch_cutoff_time || '12:00',
          dinner_cutoff_time: s.dinner_cutoff_time || '14:00',
        });
      }).catch(() => toast.error('Failed to load settings'));
    }
  }, [show]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/manager/settings/meal', {
        lunch_cutoff_time: form.lunch_cutoff_time,
        dinner_cutoff_time: form.dinner_cutoff_time,
      });
      toast.success('Settings updated');
      setShow(false);
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-slate-800 flex items-center gap-2 text-sm md:text-base">
          <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block" />
          Meal Cutoff Settings
        </h2>
        <button onClick={() => setShow(!show)} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
          {show ? 'Cancel' : 'Edit'}
        </button>
      </div>
      {show && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Lunch Cutoff Time</label>
              <input type="time" value={form.lunch_cutoff_time} onChange={e => setForm({...form, lunch_cutoff_time: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Dinner Cutoff Time</label>
              <input type="time" value={form.dinner_cutoff_time} onChange={e => setForm({...form, dinner_cutoff_time: e.target.value})}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
            </div>
          </div>
          <button onClick={save} disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function ManagerDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/manager/dashboard').then(({ data }) => setData(data)).catch(() => toast.error('Failed to load dashboard')).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-indigo-300 text-xs md:text-sm font-medium tracking-wide uppercase">Manager Panel</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Financial Overview</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 md:mt-2">Track collections, expenses, and student payments at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MgStatCard title="Total Students" value={data?.total_students || 0} icon="👨‍🎓" gradient="bg-gradient-to-br from-blue-500 to-indigo-600" />
        <MgStatCard title="Monthly Collection" value={`৳${Number(data?.total_collection || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="This month" icon="💰" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <MgStatCard title="Monthly Expenses" value={`৳${Number(data?.total_expenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="This month" icon="💸" gradient="bg-gradient-to-br from-rose-500 to-pink-600" />
        <MgStatCard title="Net Balance" value={`৳${Math.abs(Number(data?.net_balance || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub={data?.net_balance > 0 ? 'Profit' : data?.net_balance < 0 ? 'Loss' : 'Break-even'} icon="📊" gradient={data?.net_balance > 0 ? 'bg-gradient-to-br from-violet-500 to-purple-600' : data?.net_balance < 0 ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-slate-500 to-slate-600'} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <MgStatCard title="Total Due" value={`৳${Number(data?.total_due || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="This month" icon="⚠️" gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
        <MgStatCard title="Total Meals" value={data?.total_monthly_meals || 0} sub="This month" icon="🍽️" gradient="bg-gradient-to-br from-teal-500 to-cyan-600" />
        <MgStatCard title="Lunch ON Today" value={`${data?.today_lunch_on || 0} / ${data?.total_students || 0}`} sub={`Cutoff: ${data?.lunch_cutoff || '12:00'}`} icon="☀️" gradient="bg-gradient-to-br from-orange-500 to-amber-600" />
        <MgStatCard title="Dinner ON Today" value={`${data?.today_dinner_on || 0} / ${data?.total_students || 0}`} sub={`Cutoff: ${data?.dinner_cutoff || '14:00'}`} icon="🌙" gradient="bg-gradient-to-br from-indigo-500 to-purple-600" />
      </div>

      <ManagerMealSettings data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm md:text-base">
            <span className="w-1.5 h-5 bg-emerald-500 rounded-full inline-block" />
            Recent Payments
          </h2>
          {data?.recent_payments?.length ? (
            <div className="space-y-2">
              {data.recent_payments.map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-emerald-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-sm shrink-0">💳</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{p.student?.user?.name || 'Unknown'}</p>
                      <p className="text-xs text-slate-400">{new Date(p.created_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 shrink-0">+ ৳{Number(p.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-6">No payments yet</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-sm md:text-base">
            <span className="w-1.5 h-5 bg-rose-500 rounded-full inline-block" />
            Recent Expenses
          </h2>
          {data?.recent_expenses?.length ? (
            <div className="space-y-2">
              {data.recent_expenses.map((e: any) => (
                <div key={e.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-rose-50/50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center text-sm shrink-0">💸</div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{e.description || e.category}</p>
                      <p className="text-xs text-slate-400 capitalize">{e.category} • {new Date(e.expense_date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-rose-600 shrink-0">- ৳{Number(e.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-6">No expenses yet</p>
          )}
        </div>
      </div>
    </div>
  );
}