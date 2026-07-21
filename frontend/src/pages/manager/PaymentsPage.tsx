import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { getLocalDateString } from '../../utils/dateUtils';

export default function ManagerPaymentsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAdvanceForm, setShowAdvanceForm] = useState(false);
  const [advanceForm, setAdvanceForm] = useState({ student_id: '', amount: '', payment_method: 'cash', paid_at: getLocalDateString(), notes: '' });

  useEffect(() => {
    api.get('/manager/payments/summary')
      .then((s) => setSummary(s.data))
      .catch(() => toast.error('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  const handleAdvanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/manager/payments/advance', { ...advanceForm, amount: parseFloat(advanceForm.amount) });
      toast.success('Wallet credited!');
      setShowAdvanceForm(false);
      setAdvanceForm({ student_id: '', amount: '', payment_method: 'cash', paid_at: getLocalDateString(), notes: '' });
      const s = await api.get('/manager/payments/summary');
      setSummary(s.data);
    } catch { toast.error('Failed to record advance'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const t = summary?.totals || {};
  const m = summary?.monthly || {};
  const students = summary?.students || [];
  const recentActivity = summary?.recent_activity || [];
  const mealRate = summary?.prices?.meal_rate || 0;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Finance</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Payments & Wallet Overview</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Wallet is the only money pool — bills are settled from wallet balance.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-xl px-4 py-3 md:px-5 md:py-4 shadow-sm border border-slate-100">
          <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">Wallet Top-Ups</p>
          <p className="text-lg md:text-xl font-bold text-emerald-600 mt-0.5">৳{Number(t.wallet_credits || 0).toLocaleString()}</p>
          <p className="text-[10px] text-slate-400">This month: ৳{Number(m.wallet_credits || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 md:px-5 md:py-4 shadow-sm border border-slate-100">
          <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">Meal Deductions</p>
          <p className="text-lg md:text-xl font-bold text-red-500 mt-0.5">৳{Number(t.meal_deductions || 0).toLocaleString()}</p>
          <p className="text-[10px] text-slate-400">This month: ৳{Number(m.meal_deductions || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 md:px-5 md:py-4 shadow-sm border border-slate-100">
          <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">Total Due</p>
          <p className="text-lg md:text-xl font-bold text-amber-600 mt-0.5">৳{Number(t.total_due || 0).toLocaleString()}</p>
          <p className="text-[10px] text-slate-400">Net receivable: ৳{Number(t.net_receivable || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl px-4 py-3 md:px-5 md:py-4 shadow-sm border border-slate-100">
          <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">Meal Rate</p>
          <p className="text-lg md:text-xl font-bold text-slate-700 mt-0.5">৳{mealRate}</p>
          <p className="text-[10px] text-slate-400">Per meal (expenses / meals)</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setShowAdvanceForm(!showAdvanceForm)}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-200 hover:shadow-xl transition-all">
            {showAdvanceForm ? 'Cancel' : '+ Credit Wallet'}
          </button>
        </div>
      </div>

      {showAdvanceForm && (
        <form onSubmit={handleAdvanceSubmit} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 space-y-4">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full inline-block" />
            Advance Wallet Credit
          </h3>
          <p className="text-xs text-slate-500">All money received goes to the wallet — no separate bill payments needed.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Student</label>
              <select value={advanceForm.student_id} onChange={e => setAdvanceForm({...advanceForm, student_id: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" required>
                <option value="">Select student</option>
                {students.map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.room_number}) — Bal: ৳{Number(s.balance).toFixed(0)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Amount (BDT)</label>
              <input type="number" step="0.01" min="1" value={advanceForm.amount} onChange={e => setAdvanceForm({...advanceForm, amount: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Method</label>
              <select value={advanceForm.payment_method} onChange={e => setAdvanceForm({...advanceForm, payment_method: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none">
                <option value="cash">Cash</option>
                <option value="mobile_bkash">bKash</option>
                <option value="nagad">Nagad</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Date</label>
              <input type="date" value={advanceForm.paid_at} onChange={e => setAdvanceForm({...advanceForm, paid_at: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes</label>
            <input type="text" value={advanceForm.notes} onChange={e => setAdvanceForm({...advanceForm, notes: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Optional reference" />
          </div>
          <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl text-sm font-medium shadow-md">Credit Wallet</button>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm md:text-base">Recent Activity</h2>
          </div>
          {recentActivity.length === 0 ? (
            <div className="p-10 text-center">
              <span className="text-3xl block mb-2">📭</span>
              <p className="text-slate-400 text-sm">No activity yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {recentActivity.map((a: any) => (
                <div key={a.id} className="flex items-center gap-3 p-3 md:p-4 hover:bg-slate-50/50 transition-colors">
                  <div className={`w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                    a.type === 'wallet_credit' ? 'bg-emerald-100' : 'bg-blue-100'
                  }`}>
                    {a.type === 'wallet_credit' ? '💰' : '🧾'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-medium text-slate-800">{a.student_name}</p>
                    <p className="text-[10px] md:text-xs text-slate-400 truncate">{a.description}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs md:text-sm font-bold ${a.type === 'wallet_credit' ? 'text-emerald-600' : 'text-blue-600'}`}>
                      + ৳{Number(a.amount).toLocaleString()}
                    </p>
                    <p className="text-[10px] text-slate-400">{new Date(a.created_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm md:text-base">Student Wallets</h2>
          </div>
            {students.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No students</div>
          ) : (
            <div className="divide-y divide-slate-50">
              {students.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 md:p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-xs md:text-sm font-medium text-slate-800 truncate">{s.name}</p>
                    <p className="text-[10px] md:text-xs text-slate-400">{s.room_number}</p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <span className={`text-xs md:text-sm font-bold ${
                      s.balance > 0 ? 'text-emerald-600' :
                      s.balance === 0 ? 'text-slate-400' :
                      'text-red-500'
                    }`}>
                      ৳{Number(s.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                    {(s.meal_debt ?? 0) > 0 && (
                      <p className="text-[10px] text-rose-500 font-medium">Debt: ৳{Number(s.meal_debt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
