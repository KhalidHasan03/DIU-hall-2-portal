import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-medium transition-all ${
      active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}>{label}</button>
  );
}

export default function StudentMealsPage() {
  const [meals, setMeals] = useState<any[]>([]);
  const [todayStatus, setTodayStatus] = useState<any[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [bookingId, setBookingId] = useState<number | null>(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/student/meals/history'),
      api.get('/student/meals/today-status'),
      api.get('/student/wallet'),
    ]).then(([h, t, w]) => {
      setMeals(h.data);
      setTodayStatus(t.data);
      setWalletBalance(w.data.balance ?? 0);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const toggleMeal = async (mealType: string, currentStatus: string | null) => {
    const action = currentStatus === 'booked' ? 'off' : 'on';
    setBookingId(mealType === 'lunch' ? 1 : 2);
    try {
      await api.post('/student/meals/toggle', { meal_type: mealType, action });
      toast.success(action === 'on' ? 'Meal turned ON' : 'Meal turned OFF', { icon: '🍽️' });
      fetchData();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to toggle meal';
      toast.error(msg);
    } finally {
      setBookingId(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const filteredMeals = statusFilter === 'all' ? meals : meals.filter((m: any) => m.status === statusFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-56 md:h-56 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Meal Management</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">My Meals</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Book your meals and track attendance.</p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
        <p className="text-[10px] text-white/80 font-medium uppercase tracking-wider">Wallet Balance</p>
        <p className="text-xl font-bold mt-1">৳{walletBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        <p className="text-[10px] text-white/60 mt-0.5">Meal costs auto-deduct when attendance is marked</p>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <h2 className="font-semibold text-slate-800 mb-3 md:mb-5 flex items-center gap-2 text-sm md:text-base">
          <span className="w-1 h-5 bg-emerald-500 rounded-full inline-block" />
          Today's Status
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {['lunch', 'dinner'].map((mealType) => {
            const meal = todayStatus.find((t: any) => t.menu?.meal_type === mealType);
            const status = meal?.status || null;
            const isOn = status === 'booked';
            const isLoading = (mealType === 'lunch' && bookingId === 1) || (mealType === 'dinner' && bookingId === 2);
            const canToggle = meal?.can_toggle !== false;
            const cutoffTime = meal?.cutoff_time || (mealType === 'lunch' ? '12:00' : '14:00');

            return (
              <div key={mealType} className={`group relative rounded-xl p-4 md:p-5 transition-all duration-200 border ${
                !canToggle && status !== 'attended' ? 'bg-slate-100 border-slate-200 opacity-70' : 'bg-slate-50 border-slate-100 hover:shadow-md'
              }`}>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 md:gap-3 min-w-0">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center text-lg md:text-xl shrink-0 ${
                      mealType === 'lunch' ? 'bg-gradient-to-br from-orange-400/20 to-orange-500/20' : 'bg-gradient-to-br from-indigo-400/20 to-indigo-500/20'
                    }`}>
                      {mealType === 'lunch' ? '☀️' : '🌙'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm md:text-base font-semibold text-slate-800 capitalize">{mealType}</p>
                      <p className="text-xs md:text-sm text-slate-500 truncate">{meal?.menu?.menu_text || 'General'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {status === 'attended' ? (
                      <span className="px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-xs font-medium bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-200">✓ Attended</span>
                    ) : !canToggle ? (
                      <span className="text-[10px] md:text-xs text-slate-400 font-medium whitespace-nowrap">Closed at {cutoffTime}</span>
                    ) : (
                      <button
                        onClick={() => toggleMeal(mealType, status)}
                        disabled={isLoading}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                          isOn ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                          isOn ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                        {isLoading && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="animate-spin h-3 w-3 border-2 border-white rounded-full border-t-transparent" />
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                {status === 'cancelled' && (
                  <p className="text-[10px] md:text-xs text-slate-400 mt-2">You cancelled this meal</p>
                )}
                {!canToggle && status !== 'attended' && (
                  <p className="text-[10px] md:text-xs text-amber-600 mt-2">Booking closed at {cutoffTime}. Contact manager to change.</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 md:mb-5">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2 text-sm md:text-base">
            <span className="w-1 h-5 bg-violet-500 rounded-full inline-block" />
            Meal History
          </h2>
          <div className="flex gap-1 flex-wrap">
            <FilterChip label="All" active={statusFilter === 'all'} onClick={() => setStatusFilter('all')} />
            <FilterChip label="Booked" active={statusFilter === 'booked'} onClick={() => setStatusFilter('booked')} />
            <FilterChip label="Attended" active={statusFilter === 'attended'} onClick={() => setStatusFilter('attended')} />
            <FilterChip label="Cancelled" active={statusFilter === 'cancelled'} onClick={() => setStatusFilter('cancelled')} />
          </div>
        </div>
        {filteredMeals.length === 0 ? (
          <div className="text-center py-6 md:py-10 text-slate-400">
            <span className="text-3xl md:text-4xl block mb-2 md:mb-3">📋</span>
            <p className="text-sm md:text-base font-medium">No meal history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="min-w-[500px] md:min-w-0 px-4 md:px-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left px-3 md:px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Date</th>
                    <th className="text-left px-3 md:px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Meal</th>
                    <th className="text-left px-3 md:px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Menu</th>
                    <th className="text-left px-3 md:px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMeals.map((item: any) => (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="px-3 md:px-4 py-3.5 text-slate-700 font-medium text-xs md:text-sm whitespace-nowrap">{item.daily_menu?.date}</td>
                      <td className="px-3 md:px-4 py-3.5">
                        <span className="inline-flex items-center gap-1 text-xs md:text-sm capitalize text-slate-700">
                          {item.daily_menu?.meal_type === 'lunch' ? '☀️' : '🌙'} {item.daily_menu?.meal_type}
                        </span>
                      </td>
                      <td className="px-3 md:px-4 py-3.5 text-slate-600 text-xs md:text-sm max-w-[120px] md:max-w-none truncate">{item.daily_menu?.menu_text}</td>
                      <td className="px-3 md:px-4 py-3.5">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold ${
                          item.status === 'booked' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          item.status === 'attended' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-slate-50 text-slate-600 border border-slate-200'
                        }`}>{item.status}</span>
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