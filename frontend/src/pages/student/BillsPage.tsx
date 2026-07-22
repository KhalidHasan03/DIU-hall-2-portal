import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function BillProgressBar({ paid, total }: { paid: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] md:text-xs text-slate-400 mb-1.5">
        <span>Progress</span>
        <span className="font-semibold text-indigo-600">{pct}%</span>
      </div>
      <div className="w-full h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="flex justify-between text-[10px] md:text-xs text-slate-400 mt-1.5">
        <span>Paid: ৳{paid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        <span>Total: ৳{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  );
}

export default function StudentBillsPage() {
  const [currentBill, setCurrentBill] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/student/bills/current'),
      api.get('/student/bills/history'),
    ]).then(([current, hist]) => {
      setCurrentBill(current.data);
      setHistory(hist.data);
    }).catch(() => {
      setCurrentBill(null);
      setHistory([]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Billing</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">My Bills</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">View your monthly meal bills and payment status.</p>
        </div>
      </div>

      {currentBill ? (
        <div className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-sm border border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-6">
            <div>
              <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">Current Month</p>
              <h2 className="text-lg md:text-2xl font-bold text-slate-800 mt-0.5">{currentBill.month}</h2>
            </div>
            <span className={`px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-semibold capitalize ${
              currentBill.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
              currentBill.status === 'partial' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
              'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {currentBill.status}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 border border-orange-200">
              <p className="text-[10px] md:text-xs font-medium text-orange-600 uppercase tracking-wider">Lunches</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1">{currentBill.total_lunches}</p>
              {currentBill.total_lunches > 0 && <p className="text-[10px] md:text-xs text-orange-500 mt-0.5">× ৳{(currentBill.lunch_amount / currentBill.total_lunches).toFixed(2)} each</p>}
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200">
              <p className="text-[10px] md:text-xs font-medium text-indigo-600 uppercase tracking-wider">Dinners</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1">{currentBill.total_dinners}</p>
              {currentBill.total_dinners > 0 && <p className="text-[10px] md:text-xs text-indigo-500 mt-0.5">× ৳{(currentBill.dinner_amount / currentBill.total_dinners).toFixed(2)} each</p>}
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200">
              <p className="text-[10px] md:text-xs font-medium text-emerald-600 uppercase tracking-wider">Lunch Amount</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1">৳{Number(currentBill.lunch_amount).toFixed(2)}</p>
            </div>
            <div className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-violet-50 to-violet-100/50 border border-violet-200">
              <p className="text-[10px] md:text-xs font-medium text-violet-600 uppercase tracking-wider">Dinner Amount</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1">৳{Number(currentBill.dinner_amount).toFixed(2)}</p>
            </div>
          </div>

          <div className="p-4 md:p-6 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <p className="text-sm md:text-lg font-semibold text-slate-800">Total Bill</p>
              <p className="text-lg md:text-2xl font-bold text-slate-800">৳{Number(currentBill.total_amount).toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between text-xs md:text-sm text-slate-500 mb-2">
              <span>Wallet covered: ৳{Number(currentBill.paid_amount || 0).toFixed(2)}</span>
              <span>Due: ৳{Number(currentBill.due_amount || 0).toFixed(2)}</span>
            </div>
            <BillProgressBar paid={Number(currentBill.paid_amount || 0)} total={currentBill.total_amount} />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-dashed border-slate-200">
          <span className="text-3xl md:text-5xl block mb-3 md:mb-4">🧾</span>
          <p className="text-sm md:text-lg text-slate-400 font-medium">No bill for this month yet</p>
          <p className="text-xs md:text-sm text-slate-300 mt-1">Bills are generated at the start of each month.</p>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-800 mb-3 md:mb-5 flex items-center gap-2 text-sm md:text-base">
          <span className="w-1 h-5 bg-slate-400 rounded-full inline-block" />
          Bill History
        </h2>
        {history.length === 0 ? (
          <div className="text-center py-6 md:py-8 text-slate-400">
            <span className="text-2xl md:text-3xl block mb-2">📄</span>
            No bills yet
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="min-w-[500px] md:min-w-0 px-4 md:px-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-3 md:px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Month</th>
                    <th className="text-left px-3 md:px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Lunches</th>
                    <th className="text-left px-3 md:px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Dinners</th>
                    <th className="text-left px-3 md:px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Amount</th>
                    <th className="text-left px-3 md:px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((bill: any) => (
                    <tr key={bill.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-3 md:px-4 py-3.5 text-slate-700 font-medium text-xs md:text-sm">{bill.month}</td>
                      <td className="px-3 md:px-4 py-3.5 text-slate-600 text-xs md:text-sm">{bill.total_lunches}</td>
                      <td className="px-3 md:px-4 py-3.5 text-slate-600 text-xs md:text-sm">{bill.total_dinners}</td>
                      <td className="px-3 md:px-4 py-3.5 text-slate-700 font-medium text-xs md:text-sm">৳{Number(bill.total_amount).toFixed(2)}</td>
                      <td className="px-3 md:px-4 py-3.5">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold ${
                          bill.status === 'paid' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          bill.status === 'partial' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>{bill.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}