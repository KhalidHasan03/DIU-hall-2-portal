import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function MealStatusBadge({ status }: { status: string | null }) {
  if (!status) return <span className="px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold bg-slate-100 text-slate-500">Not Booked</span>;
  const styles: Record<string, string> = {
    booked: 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border border-blue-300/50',
    attended: 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-700 border border-emerald-300/50',
    cancelled: 'bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 border border-red-300/50',
  };
  return <span className={`px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold capitalize ${styles[status] || styles.booked}`}>{status}</span>;
}

function StatCard({ title, value, sub, gradient, icon }: { title: string; value: string | number; sub?: string; gradient: string; icon: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-4 md:p-6 text-white ${gradient} shadow-lg`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 md:w-32 md:h-32" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 md:w-24 md:h-24" />
      <div className="relative">
        <div className="flex items-center justify-between mb-1 md:mb-2">
          <span className="text-xl md:text-3xl">{icon}</span>
          <span className="text-lg md:text-2xl font-bold tracking-tight">{value}</span>
        </div>
        <p className="text-[11px] md:text-sm text-white/80 font-medium">{title}</p>
        {sub && <p className="text-[10px] md:text-xs text-white/60 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    api.get('/student/dashboard').then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const dueAmount = data?.due_amount || 0;
  const totalBill = data?.current_bill?.total_amount || 0;
  const paidAmount = data?.paid_amount || 0;
  const billProgress = totalBill > 0 ? Math.round((paidAmount / totalBill) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 p-5 md:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl md:w-64 md:h-64" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl md:w-96 md:h-96" />
        <div className="relative">
          <p className="text-indigo-300 text-xs md:text-sm font-medium tracking-wide uppercase">{greeting}</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Welcome back, {data?.student_name || 'Student'}</h1>
          <p className="text-slate-400 text-xs md:text-sm mt-1 md:mt-2 max-w-xl">
            Track your meals, manage bookings, and stay on top of your hall expenses.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-sm md:text-lg font-semibold text-slate-800 mb-3 md:mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
          Today's Meals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {data?.today_meals?.length ? data.today_meals.map((meal: any) => (
            <div key={meal.meal_type} className="group relative bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 md:gap-4 min-w-0">
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-lg md:text-2xl shrink-0 ${
                    meal.meal_type === 'lunch' ? 'bg-gradient-to-br from-orange-400/20 to-orange-500/20' : 'bg-gradient-to-br from-indigo-400/20 to-indigo-500/20'
                  }`}>
                    {meal.meal_type === 'lunch' ? '☀️' : '🌙'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 capitalize text-sm md:text-lg">{meal.meal_type}</p>
                    <p className="text-slate-500 text-xs md:text-sm mt-0.5 truncate">{meal.menu_text || 'Menu not set'}</p>
                  </div>
                </div>
                <MealStatusBadge status={meal.status} />
              </div>
            </div>
          )) : (
            <div className="col-span-full bg-white rounded-2xl p-6 md:p-8 text-center border border-dashed border-slate-200">
              <p className="text-slate-400 text-sm md:text-lg font-medium">No meals scheduled for today</p>
              <p className="text-slate-300 text-xs md:text-sm mt-1">Your hall manager will update the menu soon.</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard title="Monthly Bill" value={`৳${totalBill}`} sub={data?.current_bill?.month ? `Period: ${data.current_bill.month}` : 'No bill yet'} gradient="bg-gradient-to-br from-emerald-500 to-teal-600" icon="🧾" />
        <StatCard title="Paid Amount" value={`৳${paidAmount}`} sub={`${billProgress}% of total bill`} gradient="bg-gradient-to-br from-blue-500 to-indigo-600" icon="💰" />
        <StatCard title="Due Amount" value={`৳${dueAmount}`} sub={dueAmount > 0 ? 'Payment pending' : 'All clear!'} gradient={dueAmount > 0 ? 'bg-gradient-to-br from-rose-500 to-pink-600' : 'bg-gradient-to-br from-slate-500 to-slate-600'} icon={dueAmount > 0 ? '⚠️' : '✅'} />
        <StatCard title="Wallet Balance" value={`৳${(data?.wallet_balance ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} sub="Prepaid meal fund" gradient="bg-gradient-to-br from-emerald-500 to-teal-600" icon="👛" />
        <StatCard title="Meals This Month" value={data?.meal_stats?.total || 0} sub={`${data?.meal_stats?.attended || 0} attended`} gradient="bg-gradient-to-br from-violet-500 to-purple-600" icon="🍽️" />
      </div>

      {totalBill > 0 && (
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm md:text-base font-semibold text-slate-800">Bill Payment Progress</h3>
            <span className="text-sm font-bold text-indigo-600">{billProgress}%</span>
          </div>
          <div className="w-full h-2.5 md:h-3 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700 ease-out" style={{ width: `${billProgress}%` }} />
          </div>
          <div className="flex justify-between text-[10px] md:text-xs text-slate-400 mt-2">
            <span>Paid: ৳{paidAmount}</span>
            <span>Total: ৳{totalBill}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <h2 className="text-sm md:text-lg font-semibold text-slate-800 mb-3 md:mb-4 flex items-center gap-2">
          <span className="w-1 h-5 bg-amber-500 rounded-full inline-block" />
          Recent Notices
        </h2>
        {data?.notices?.length ? (
          <div className="space-y-2 md:space-y-3">
            {data.notices.map((n: any) => (
              <div key={n.id} className="group flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 transition-colors cursor-default">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-500/20 flex items-center justify-center text-base md:text-lg shrink-0">
                  📢
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm md:text-base font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">{n.title}</h3>
                  <p className="text-xs md:text-sm text-slate-500 mt-0.5 line-clamp-2">{n.content}</p>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-1">{new Date(n.created_at).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 md:py-8 text-slate-400">
            <span className="text-2xl md:text-3xl block mb-2">📭</span>
            No notices yet
          </div>
        )}
      </div>
    </div>
  );
}