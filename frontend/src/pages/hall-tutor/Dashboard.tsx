import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const rankEmojis = ['👑', '🥈', '🥉'];
const rankBadgeColors = ['bg-yellow-100 text-yellow-800', 'bg-slate-100 text-slate-700', 'bg-amber-100 text-amber-800'];

function StatCard({ title, value, sub, icon, gradient }: { title: string; value: string | number; sub?: string; icon: string; gradient: string }) {
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

const activityIcons: Record<string, string> = {
  created: '➕', updated: '✏️', deleted: '🗑️', approved: '✅', rejected: '❌', login: '🔑', payment: '💰', expense: '💸',
};

export default function TutorDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/hall-tutor/dashboard').then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const netProfit = Number(data?.net_profit || 0);

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-indigo-300 text-xs md:text-sm font-medium tracking-wide uppercase">Hall Tutor Panel</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Dashboard</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 md:mt-2">Monitor hall finances and student dues at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Total Students" value={data?.total_students || 0} icon="👨‍🎓" gradient="bg-gradient-to-br from-blue-500 to-indigo-600" />
        <StatCard title="Collection" value={`৳${Number(data?.total_collection || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="This month" icon="💰" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard title="Expenses" value={`৳${Number(data?.total_expenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub="This month" icon="💸" gradient="bg-gradient-to-br from-rose-500 to-pink-600" />
        <StatCard title="Net Profit" value={`৳${Math.abs(netProfit).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} sub={netProfit > 0 ? 'Profit' : netProfit < 0 ? 'Loss' : 'Break-even'} icon="📊" gradient={netProfit > 0 ? 'bg-gradient-to-br from-violet-500 to-purple-600' : netProfit < 0 ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-slate-500 to-slate-600'} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <StatCard title="Pending Reports" value={data?.pending_reports || 0} sub={data?.pending_reports > 0 ? 'Needs attention' : 'All clear'} icon="📋" gradient="bg-gradient-to-br from-amber-500 to-orange-600" />
        <StatCard title="Pending Approvals" value={data?.pending_students || 0} sub={data?.pending_students > 0 ? 'Review needed' : 'All clear'} icon="⏳" gradient="bg-gradient-to-br from-indigo-500 to-purple-600" />
      </div>

      {data?.pending_students > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-xl">⏳</span>
          <p className="text-sm text-amber-800"><strong>{data.pending_students}</strong> student(s) awaiting approval. <a href="/dashboard/hall-tutor/approvals" className="underline font-medium">Review now</a></p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm md:text-base font-semibold text-slate-800 mb-3 md:mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-rose-500 rounded-full inline-block" />
            Top Due Students
          </h2>
          {data?.due_students?.length ? (
            <div className="space-y-2">
              {data.due_students.map((item: any, i: number) => {
                const isTop3 = i < 3;
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-amber-50/50 transition-colors border border-transparent hover:border-amber-200">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${isTop3 ? rankBadgeColors[i] : 'bg-slate-200 text-slate-500'}`}>
                        {isTop3 ? rankEmojis[i] : `#${i + 1}`}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-700 truncate">{item.student_name}</p>
                        <p className="text-xs text-slate-400">Room {item.room_number}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <p className={`text-sm font-bold ${item.due > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        ৳{Number(item.due).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        of ৳{Number(item.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-3xl block mb-2">✅</span>
              <p className="text-slate-400 text-sm font-medium">No due students</p>
              <p className="text-xs text-slate-300 mt-1">All bills are up to date</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <h2 className="text-sm md:text-base font-semibold text-slate-800 mb-3 md:mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 bg-blue-500 rounded-full inline-block" />
            Recent Activities
          </h2>
          {data?.recent_activities?.length ? (
            <div className="space-y-2">
              {data.recent_activities.map((a: any) => {
                const actionKey = Object.keys(activityIcons).find(k => a.action?.toLowerCase().includes(k));
                const icon = actionKey ? activityIcons[actionKey] : '📌';
                return (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-blue-50/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm shrink-0">{icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm text-slate-700">
                        <span className="font-medium text-slate-800">{a.user?.name || 'System'}</span>
                        <span className="text-slate-500"> {a.action}</span>
                      </p>
                      <p className="text-[10px] md:text-xs text-slate-400 mt-0.5">
                        {new Date(a.created_at).toLocaleDateString('en-BD', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-3xl block mb-2">📭</span>
              <p className="text-slate-400 text-sm font-medium">No activity yet</p>
              <p className="text-xs text-slate-300 mt-1">Actions will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
