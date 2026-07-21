import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManagerAttendancePage() {
  const [students, setStudents] = useState<any[]>([]);
  const [cutoffs, setCutoffs] = useState({ lunch_cutoff_time: '12:00', dinner_cutoff_time: '14:00' });
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<{ id: number; meal: string } | null>(null);
  const [showCutoffForm, setShowCutoffForm] = useState(false);
  const [cutoffForm, setCutoffForm] = useState({ lunch_cutoff_time: '', dinner_cutoff_time: '' });
  const [savingCutoff, setSavingCutoff] = useState(false);

  const fetchStatus = () => {
    api.get('/manager/meals/today-status-all').then(({ data }) => {
      setStudents(data.students || data || []);
      if (data.cutoffs) setCutoffs(data.cutoffs);
    }).catch(() => {
      toast.error('Failed to load attendance data');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStatus(); }, []);

  const toggleMeal = async (studentId: number, mealType: string, currentStatus: boolean) => {
    setToggling({ id: studentId, meal: mealType });
    try {
      await api.post('/manager/meals/toggle', {
        student_id: studentId,
        meal_type: mealType,
        action: currentStatus ? 'off' : 'on',
      });
      setStudents(prev => prev.map(s =>
        s.id === studentId
          ? { ...s, [mealType === 'lunch' ? 'lunch_on' : 'dinner_on']: !currentStatus }
          : s
      ));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to toggle meal');
    } finally {
      setToggling(null);
    }
  };

  const editCutoffs = () => {
    setCutoffForm({ ...cutoffs });
    setShowCutoffForm(true);
  };

  const saveCutoffs = async () => {
    setSavingCutoff(true);
    try {
      await api.put('/manager/settings/meal', {
        lunch_cutoff_time: cutoffForm.lunch_cutoff_time,
        dinner_cutoff_time: cutoffForm.dinner_cutoff_time,
      });
      setCutoffs({ ...cutoffForm });
      toast.success('Cutoff times updated');
      setShowCutoffForm(false);
    } catch {
      toast.error('Failed to update cutoff times');
    } finally {
      setSavingCutoff(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const lunchOn = students.filter((s: any) => s.lunch_on).length;
  const dinnerOn = students.filter((s: any) => s.dinner_on).length;

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Meal Attendance</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Today's Attendance</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Toggle each student's lunch and dinner status for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 md:p-6 text-white shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Food Preparation</p>
            <p className="text-sm md:text-base mt-1 text-white/70">Total meals to cook today</p>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <p className="text-2xl md:text-3xl font-bold">{lunchOn}</p>
                <p className="text-xs md:text-sm text-white/80">Lunches ☀️</p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-bold">{dinnerOn}</p>
                <p className="text-xs md:text-sm text-white/80">Dinners 🌙</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Lunch Cutoff</p>
            <span className="text-lg">☀️</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-slate-800">{cutoffs.lunch_cutoff_time}</p>
          <p className="text-xs text-slate-400 mt-1">Students can book lunch until this time</p>
        </div>

        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Dinner Cutoff</p>
            <span className="text-lg">🌙</span>
          </div>
          <p className="text-xl md:text-2xl font-bold text-slate-800">{cutoffs.dinner_cutoff_time}</p>
          <p className="text-xs text-slate-400 mt-1">Students can book dinner until this time</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base flex items-center gap-2">
            <span className="w-1.5 h-5 bg-indigo-500 rounded-full inline-block" />
            Meal Cutoff Times
          </h2>
          <button onClick={showCutoffForm ? () => setShowCutoffForm(false) : editCutoffs}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">
            {showCutoffForm ? 'Cancel' : 'Change Cutoff Times'}
          </button>
        </div>
        {showCutoffForm && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Lunch Cutoff Time</label>
                <input type="time" value={cutoffForm.lunch_cutoff_time}
                  onChange={e => setCutoffForm({...cutoffForm, lunch_cutoff_time: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Dinner Cutoff Time</label>
                <input type="time" value={cutoffForm.dinner_cutoff_time}
                  onChange={e => setCutoffForm({...cutoffForm, dinner_cutoff_time: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
              </div>
            </div>
            <button onClick={saveCutoffs} disabled={savingCutoff}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50">
              {savingCutoff ? 'Saving...' : 'Save Cutoff Times'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base">All Students ({students.length})</h2>
        </div>
        {students.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-3">👥</span>
            <p className="text-slate-400 font-medium">No active students found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Room</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Lunch</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Dinner</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s: any) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{s.name}</td>
                    <td className="px-4 py-3.5 text-slate-500">{s.room_number}</td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleMeal(s.id, 'lunch', s.lunch_on)}
                        disabled={toggling?.id === s.id && toggling?.meal === 'lunch'}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          s.lunch_on ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          s.lunch_on ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => toggleMeal(s.id, 'dinner', s.dinner_on)}
                        disabled={toggling?.id === s.id && toggling?.meal === 'dinner'}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                          s.dinner_on ? 'bg-emerald-500' : 'bg-slate-200'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                          s.dinner_on ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
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
