import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getLocalMonthString } from '../../utils/dateUtils';

export default function TutorReportsPage() {
  const [month, setMonth] = useState(getLocalMonthString());
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/hall-tutor/reports/monthly', { params: { month } }).then(({ data }) => setReport(data)).finally(() => setLoading(false));
  }, [month]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Reports</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Monthly Reports</h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">Month:</span>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
      </div>

      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500">Total Bills</p>
            <p className="text-lg md:text-2xl font-bold mt-1">৳{Number(report.total_bills).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500">Collected</p>
            <p className="text-lg md:text-2xl font-bold text-emerald-600 mt-1">৳{Number(report.total_collected).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500">Expenses</p>
            <p className="text-lg md:text-2xl font-bold text-rose-600 mt-1">৳{Number(report.total_expenses).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500">Net Profit</p>
            <p className={`text-lg md:text-2xl font-bold mt-1 ${report.net_profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>৳{Number(report.net_profit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      )}
    </div>
  );
}