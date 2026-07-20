import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function TutorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hall-tutor/dashboard').then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-indigo-800 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-indigo-300 text-xs md:text-sm font-medium uppercase tracking-wider">Overview</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Hall Tutor Dashboard</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1">Monitor hall finances and student dues at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Total Students</p>
          <p className="text-lg md:text-2xl font-bold text-slate-800 mt-1">{data?.total_students || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Collection</p>
          <p className="text-lg md:text-2xl font-bold text-emerald-600 mt-1">৳{data?.total_collection || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Expenses</p>
          <p className="text-lg md:text-2xl font-bold text-rose-600 mt-1">৳{data?.total_expenses || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Net Profit</p>
          <p className={`text-lg md:text-2xl font-bold mt-1 ${data?.net_profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>৳{data?.net_profit || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Pending Reports</p>
          <p className="text-lg md:text-2xl font-bold text-amber-600 mt-1">{data?.pending_reports || 0}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <p className="text-xs text-slate-500 font-medium">Pending Approvals</p>
          <p className="text-lg md:text-2xl font-bold text-indigo-600 mt-1">{data?.pending_students || 0}</p>
        </div>
      </div>

      {data?.pending_students > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-xl">⏳</span>
          <p className="text-sm text-indigo-800"><strong>{data.pending_students}</strong> student(s) awaiting approval. <a href="/dashboard/hall-tutor/approvals" className="underline font-medium">Review now</a></p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm md:text-base font-semibold text-slate-800 mb-3 md:mb-4">Top Due Students</h2>
          {data?.due_students?.length ? (
            <div className="space-y-2">
              {data.due_students.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 md:p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition-colors">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">{item.student_name}</p>
                    <p className="text-xs text-slate-400">Room: {item.room_number}</p>
                  </div>
                  <span className="text-sm font-bold text-rose-600 shrink-0">৳{item.due}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-6">No due students</p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm md:text-base font-semibold text-slate-800 mb-3 md:mb-4">Recent Activities</h2>
          {data?.recent_activities?.length ? (
            <div className="space-y-2">
              {data.recent_activities.map((a: any) => (
                <div key={a.id} className="text-xs md:text-sm p-2 md:p-3 rounded-xl bg-slate-50">
                  <span className="font-medium text-slate-700">{a.user?.name}</span>
                  <span className="text-slate-500"> {a.action}</span>
                  <span className="text-[10px] md:text-xs text-slate-400 ml-1 md:ml-2">{new Date(a.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-6">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
}