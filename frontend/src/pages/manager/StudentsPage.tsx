import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManagerStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = () => {
    setLoading(true);
    api.get('/manager/students/meal-summary').then(({ data }) => {
      setStudents(data || []);
    }).catch(() => toast.error('Failed to load students')).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Students</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Meal & Wallet Overview</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Monitor meal status, wallet balance, and consumption for all students.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base">All Students ({students.length})</h2>
          <button onClick={fetchStudents} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">Refresh</button>
        </div>
        {students.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-3">👨‍🎓</span>
            <p className="text-slate-400 font-medium">No approved students yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Room</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Wallet</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Today</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">This Month</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s: any) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-800">{s.name}</div>
                      <div className="text-xs text-slate-400">{s.email}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{s.room_number}</td>
                    <td className="px-4 py-3.5 text-right">
                      <span className={`font-bold ${s.balance > 0 ? 'text-emerald-600' : s.balance === 0 ? 'text-slate-400' : 'text-red-500'}`}>
                        ৳{Number(s.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span title="Lunch">{s.lunch_today ? '🍳' : '⚪'}</span>
                        <span title="Dinner">{s.dinner_today ? '🌙' : '⚪'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="text-xs">
                        <span className="font-semibold text-slate-700">{s.total_month_meals}</span>
                        <span className="text-slate-400"> meals</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {s.month_lunches}L / {s.month_dinners}D
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        s.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                        s.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-500'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
