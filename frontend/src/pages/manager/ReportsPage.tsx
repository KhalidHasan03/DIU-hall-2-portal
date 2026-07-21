import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { getLocalMonthString } from '../../utils/dateUtils';

export default function ManagerReportsPage() {
  const [month, setMonth] = useState(getLocalMonthString());
  const [summary, setSummary] = useState<any>(null);
  const [detailed, setDetailed] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<string>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/manager/reports/monthly', { params: { month } }),
      api.get('/manager/reports/detailed', { params: { month } }),
    ]).then(([s, d]) => {
      setSummary(s.data);
      setDetailed(d.data);
    }).catch(() => toast.error('Failed to load report'))
    .finally(() => setLoading(false));
  }, [month]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  const sortedStudents = detailed?.students?.length
    ? [...detailed.students].sort((a: any, b: any) => {
        const av = a[sortField] ?? '';
        const bv = b[sortField] ?? '';
        const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : [];

  const handleExport = () => {
    const token = localStorage.getItem('token');
    const url = `${window.location.origin}/api/v1/manager/reports/export?month=${month}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => { if (!res.ok) throw new Error(); return res.blob(); })
      .then(blob => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `monthly-report-${month}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success('Report exported!');
      })
      .catch(() => toast.error('Export failed'));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const s = summary || {};
  const t = detailed?.totals || {};

  const SortIcon = ({ field }: { field: string }) => (
    <span className="inline-block ml-1 text-[10px] opacity-50">
      {sortField === field ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <style>{`@media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } }`}</style>

      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-slate-400 text-xs md:text-sm font-medium uppercase tracking-wider">Reports</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Monthly Report</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Comprehensive student meal & payment analysis.</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-600">Month:</span>
          <input type="month" value={month} onChange={e => setMonth(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
        </div>
        <div className="flex gap-2">
          <button onClick={handleExport}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all">
            ⬇ CSV Export
          </button>
          <button onClick={handlePrint}
            className="px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all">
            🖨 Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Students Billed</p>
          <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">{s.total_students || 0}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            <span className="text-emerald-600">{s.paid_students || 0} paid</span>
            {' / '}
            <span className="text-amber-600">{s.pending_students || 0} pending</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Total Meals Served</p>
          <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">{t.total_meals || 0}</p>
          <p className="text-xs text-slate-400 mt-0.5">{s.total_lunches || 0} lunches / {s.total_dinners || 0} dinners</p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Wallet Activity</p>
          <p className="text-xl md:text-2xl font-bold text-emerald-600 mt-1">৳{Number(t.wallet_credits || 0).toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">Meal costs: ৳{Number(t.meal_costs || 0).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Bill Collection</p>
          <p className="text-xl md:text-2xl font-bold text-blue-600 mt-1">৳{Number(t.bill_paid || 0).toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Wallet-covered / ৳{Number(t.bill_totals || 0).toLocaleString()} total
            {t.bill_due > 0 && <span className="text-rose-500"> (৳{Number(t.bill_due).toLocaleString()} due)</span>}
            {t.get_back > 0 && <span className="text-emerald-500"> (৳{Number(t.get_back).toLocaleString()} surplus)</span>}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
            <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
            Student Breakdown
          </h2>
          <span className="text-xs text-slate-400">{sortedStudents.length} student{sortedStudents.length !== 1 ? 's' : ''}</span>
        </div>
        <p className="text-xs text-slate-400 mb-4">Meal Rate: ৳{detailed?.meal_rate || 0} per meal (total expenses ÷ total meals)</p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="text-left px-3 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none hover:text-slate-700" onClick={() => handleSort('name')}>
                  Student <SortIcon field="name" />
                </th>
                <th className="text-left px-3 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Room</th>
                <th className="text-center px-3 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none hover:text-slate-700" onClick={() => handleSort('total_meals')}>
                  Meals <SortIcon field="total_meals" />
                </th>
                <th className="text-right px-3 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none hover:text-slate-700" onClick={() => handleSort('meal_cost')}>
                  Meal Cost <SortIcon field="meal_cost" />
                </th>
                <th className="text-right px-3 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none hover:text-slate-700" onClick={() => handleSort('wallet_credits')}>
                  Wallet In <SortIcon field="wallet_credits" />
                </th>
                <th className="text-right px-3 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none hover:text-slate-700" onClick={() => handleSort('balance')}>
                  Balance <SortIcon field="balance" />
                </th>
                <th className="text-right px-3 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none hover:text-slate-700" onClick={() => handleSort('bill_total')}>
                  Bill Total <SortIcon field="bill_total" />
                </th>
                <th className="text-right px-3 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none hover:text-slate-700" onClick={() => handleSort('bill_due')}>
                  Due <SortIcon field="bill_due" />
                </th>
                <th className="text-right px-3 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider cursor-pointer select-none hover:text-slate-700" onClick={() => handleSort('get_back')}>
                  Get Back <SortIcon field="get_back" />
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((st: any) => (
                <tr key={st.id} className="border-b border-slate-50 hover:bg-indigo-50/30 transition-colors">
                  <td className="px-3 py-3.5">
                    <div className="font-medium text-slate-800">{st.name}</div>
                    <div className="text-[10px] text-slate-400">{st.student_id}</div>
                  </td>
                  <td className="px-3 py-3.5 text-slate-500 text-xs">{st.room_number}</td>
                  <td className="px-3 py-3.5 text-center">
                    <span className="font-semibold text-slate-700">{st.total_meals}</span>
                    <span className="text-slate-400"> meals</span>
                  </td>
                  <td className="px-3 py-3.5 text-right font-medium text-slate-700">৳{Number(st.meal_cost).toLocaleString()}</td>
                  <td className="px-3 py-3.5 text-right font-medium text-emerald-600">৳{Number(st.wallet_credits).toLocaleString()}</td>
                  <td className="px-3 py-3.5 text-right">
                    <span className={`font-bold ${st.balance > 0 ? 'text-emerald-600' : st.balance === 0 ? 'text-slate-400' : 'text-red-500'}`}>
                      ৳{Number(st.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right font-medium text-slate-700">৳{Number(st.bill_total).toLocaleString()}</td>
                  <td className="px-3 py-3.5 text-right">
                    <span className={`font-semibold ${st.bill_due > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {st.bill_due > 0 ? `৳${Number(st.bill_due).toLocaleString()}` : '✓'}
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    {st.get_back > 0 ? (
                      <span className="font-semibold text-emerald-600">৳{Number(st.get_back).toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedStudents.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <span className="text-3xl block mb-2">📋</span>
            <p className="text-sm font-medium">No data for this month</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-800 text-sm md:text-base mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-amber-500 rounded-full inline-block" />
          Financial Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <p className="text-xs text-emerald-700 font-medium">Collected (Wallet)</p>
            <p className="text-lg font-bold text-emerald-800">৳{Number(s.total_collected || 0).toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
            <p className="text-xs text-rose-700 font-medium">Expenses</p>
            <p className="text-lg font-bold text-rose-800">৳{Number(s.total_expenses || 0).toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">Wallet Credits</p>
            <p className="text-lg font-bold text-blue-800">৳{Number(t.wallet_credits || 0).toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-violet-50 border border-violet-200">
            <p className="text-xs text-violet-700 font-medium">Surplus (Get Back)</p>
            <p className="text-lg font-bold text-violet-800">৳{Number(s.total_get_back || t.get_back || 0).toLocaleString()}</p>
          </div>
          <div className={`p-3 rounded-xl border ${(s.net_profit || 0) >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <p className={`text-xs font-medium ${(s.net_profit || 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>Net Profit</p>
            <p className={`text-lg font-bold ${(s.net_profit || 0) >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              ৳{Number(s.net_profit || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400 py-4 no-print">
        Report for {month} · Generated on {new Date().toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
}
