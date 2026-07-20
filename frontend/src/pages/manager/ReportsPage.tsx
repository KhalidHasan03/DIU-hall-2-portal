import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function ManagerReportsPage() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get('/manager/reports/monthly', { params: { month } }).then(({ data }) => setReport(data)).finally(() => setLoading(false));
  }, [month]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Reports</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Monthly Financial Report</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Overview of collections, expenses, and student payments.</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600">Select Month:</span>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
      </div>

      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Total Bills</p>
            <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1">৳{report.total_bills}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Collected</p>
            <p className="text-lg md:text-2xl font-bold text-emerald-600 mt-1">৳{report.total_collected}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Expenses</p>
            <p className="text-lg md:text-2xl font-bold text-rose-600 mt-1">৳{report.total_expenses}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Net Profit</p>
            <p className={`text-lg md:text-2xl font-bold mt-1 ${report.net_profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>৳{report.net_profit}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Total Students</p>
            <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1">{report.total_students}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 font-medium">Paid / Pending</p>
            <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1">{report.paid_students}/{report.pending_students}</p>
          </div>
        </div>
      )}
    </div>
  );
}