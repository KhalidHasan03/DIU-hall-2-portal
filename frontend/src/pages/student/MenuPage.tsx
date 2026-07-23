import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

function MealCard({ item, variant }: { item: any; variant: 'lunch' | 'dinner' }) {
  const isLunch = variant === 'lunch';
  return (
    <div className="group relative bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 rounded-full -translate-y-1/2 translate-x-1/2 transition-opacity ${isLunch ? 'bg-orange-500/5' : 'bg-indigo-500/5'}`} />
      <div className="relative">
        <div className="flex items-start gap-3 md:gap-4">
          <div className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-xl md:text-3xl shrink-0 ${
            isLunch ? 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-orange-200' : 'bg-gradient-to-br from-indigo-400 to-indigo-500 shadow-indigo-200'
          } shadow-lg text-white`}>
            {isLunch ? '☀️' : '🌙'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400">
              {item.date ? new Date(item.date).toLocaleDateString('en-BD', { weekday: 'long' }) : 'Today'}
            </p>
            <h3 className="text-base md:text-lg font-bold text-slate-800 capitalize mt-0.5">{variant}</h3>
            <p className="text-xs md:text-sm text-slate-600 mt-1 md:mt-2 leading-relaxed">{item.menu_text || 'No menu set'}</p>
            {item.date && (
              <p className="text-[10px] md:text-xs text-slate-400 mt-2 md:mt-3 flex items-center gap-1">
                <span>📅</span>
                {new Date(item.date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentMenuPage() {
  const [todayMenu, setTodayMenu] = useState<any[]>([]);
  const [pastMenu, setPastMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pastLoading, setPastLoading] = useState(false);
  const [tab, setTab] = useState<'today' | 'past'>('today');

  useEffect(() => {
    api.get('/student/menu/today')
      .then(({ data }) => setTodayMenu(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (tab !== 'past') return;
    setPastLoading(true);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fmt = (d: Date) => d.toISOString().slice(0, 10);
    api.get('/student/menu/range', { params: { from: fmt(sevenDaysAgo), to: fmt(yesterday) } })
      .then(({ data }) => setPastMenu(data))
      .catch(() => setPastMenu([]))
      .finally(() => setPastLoading(false));
  }, [tab]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const todayLunch = todayMenu.find(m => m.meal_type === 'lunch');
  const todayDinner = todayMenu.find(m => m.meal_type === 'dinner');

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Meal Menu</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">What's Cooking?</h1>
        </div>
      </div>

      <div className="flex gap-1.5 md:gap-2 bg-white rounded-2xl p-1 shadow-sm border border-slate-100 w-fit">
        <button onClick={() => setTab('today')} className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
          tab === 'today' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200' : 'text-slate-600 hover:text-slate-800'
        }`}>
          <span className="mr-1">📅</span> Today
        </button>
        <button onClick={() => setTab('past')} className={`px-4 md:px-6 py-2 md:py-2.5 rounded-xl text-xs md:text-sm font-medium transition-all ${
          tab === 'past' ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-200' : 'text-slate-600 hover:text-slate-800'
        }`}>
          <span className="mr-1">📆</span> Past Days
        </button>
      </div>

      {tab === 'today' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <MealCard item={todayLunch || { meal_type: 'lunch', menu_text: null }} variant="lunch" />
          <MealCard item={todayDinner || { meal_type: 'dinner', menu_text: null }} variant="dinner" />
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {pastLoading ? (
            <div className="flex justify-center py-8"><LoadingSpinner /></div>
          ) : pastMenu.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 md:p-12 text-center border border-dashed border-slate-200">
              <span className="text-3xl md:text-5xl block mb-3 md:mb-4">📆</span>
              <p className="text-sm md:text-lg text-slate-400 font-medium">No past menus available</p>
              <p className="text-xs md:text-sm text-slate-300 mt-1">Menus from the last 7 days will appear here.</p>
            </div>
          ) : (
            ['lunch', 'dinner'].map(type => {
              const meals = pastMenu.filter((m: any) => m.meal_type === type);
              if (!meals.length) return null;
              return (
                <div key={type} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-5">
                    <span className="text-xl md:text-2xl">{type === 'lunch' ? '☀️' : '🌙'}</span>
                    <h3 className="font-bold text-slate-800 capitalize text-base md:text-lg">{type}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
                    {meals.map((meal: any) => (
                      <div key={meal.id} className="p-3 md:p-4 rounded-xl bg-slate-50 hover:bg-indigo-50/50 transition-colors border border-slate-100">
                        <p className="text-[10px] md:text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          {new Date(meal.date).toLocaleDateString('en-BD', { weekday: 'short' })}
                        </p>
                        <p className="text-xs md:text-sm text-slate-700 font-medium mt-0.5">
                          {new Date(meal.date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
                        </p>
                        <p className="text-[11px] md:text-sm text-slate-600 mt-1 md:mt-2 leading-relaxed">{meal.menu_text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
