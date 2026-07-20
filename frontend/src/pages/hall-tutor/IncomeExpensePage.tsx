import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function TutorIncomeExpensePage() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/hall-tutor/income-expenses', { params: { year } }).then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, [year]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const totalIncome = data.reduce((s: number, d: any) => s + d.income, 0);
  const totalExpense = data.reduce((s: number, d: any) => s + d.expense, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Financials</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Income vs Expenses</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Yearly comparison of hall income and expenses.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">Year:</span>
        <input type="number" value={year} onChange={e => setYear(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 outline-none w-20" />
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">Total Income</p>
          <p className="text-lg md:text-2xl font-bold text-emerald-600 mt-1">৳{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500">Total Expenses</p>
          <p className="text-lg md:text-2xl font-bold text-rose-600 mt-1">৳{totalExpense.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <h2 className="text-sm md:text-base font-semibold text-slate-800 mb-4">Monthly Breakdown</h2>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="min-w-[600px] px-4 md:px-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Month</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Income</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Expenses</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Net</th>
                </tr>
              </thead>
              <tbody>
                {data.map((d: any) => (
                  <tr key={d.month} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{d.month}</td>
                    <td className="px-4 py-3.5 text-right text-emerald-600">৳{d.income}</td>
                    <td className="px-4 py-3.5 text-right text-rose-600">৳{d.expense}</td>
                    <td className={`px-4 py-3.5 text-right font-medium ${d.income - d.expense >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      ৳{d.income - d.expense}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}