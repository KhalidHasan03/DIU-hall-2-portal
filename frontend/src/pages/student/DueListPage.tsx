import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { getLocalMonthString } from '../../utils/dateUtils';

const rankEmojis = ['👑', '🥈', '🥉'];
const rankColors = ['bg-yellow-50 border-yellow-300', 'bg-slate-50 border-slate-300', 'bg-amber-50 border-amber-300'];
const rankBadgeColors = ['bg-yellow-100 text-yellow-800', 'bg-slate-100 text-slate-700', 'bg-amber-100 text-amber-800'];

function FunnyWinnerBanner({ student, month }: { student: any; month: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 p-6 md:p-8 shadow-xl text-white">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
      <div className="relative text-center">
        <span className="text-5xl md:text-6xl block mb-2">👑</span>
        <p className="text-xs md:text-sm font-medium uppercase tracking-widest text-white/80">🏆 Month's Funny Winner 🏆</p>
        <h2 className="text-2xl md:text-4xl font-black mt-1 drop-shadow-lg">{student.name}</h2>
        <p className="text-lg md:text-xl font-bold mt-1 text-yellow-100">
          ৳{Number(student.due).toLocaleString()} Due — Room {student.room_number}
        </p>
        <p className="text-sm text-white/70 mt-2 max-w-md mx-auto">
          Congrats on being the <strong>most dues-endowed</strong> student of {month}! 🎉
          Pay your dues to pass the crown to someone else next month! 😅
        </p>
      </div>
    </div>
  );
}

function TopBar({ totalDue, studentCount }: { totalDue: number; studentCount: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100">
        <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">Total Due Hall-Wide</p>
        <p className="text-xl md:text-2xl font-bold text-rose-600 mt-1">৳{totalDue.toLocaleString()}</p>
      </div>
      <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-100">
        <p className="text-[10px] md:text-xs text-slate-500 font-medium uppercase tracking-wider">Students Listed</p>
        <p className="text-xl md:text-2xl font-bold text-slate-800 mt-1">{studentCount}</p>
      </div>
    </div>
  );
}

export default function StudentDueListPage() {
  const [month, setMonth] = useState(getLocalMonthString());
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredRank, setHoveredRank] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get('/student/bills/due-list', { params: { month } })
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false));
  }, [month]);

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  const students = data?.students || [];
  const topDueStudent = students.find((s: any) => s.rank === 1);
  const hasDue = data?.has_due_students && topDueStudent?.due > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-purple-700 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-56 md:h-56 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">🎮 Due List Leaderboard</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Who Owes What?</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">
            The higher your due, the higher your rank. Don't be this month's <strong>Funny Winner</strong>! 🏆
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-600">📅 Month:</span>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" />
      </div>

      <TopBar totalDue={data?.total_due || 0} studentCount={students.length} />

      {hasDue && <FunnyWinnerBanner student={topDueStudent} month={month} />}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base">
            🏅 Due Leaderboard ({students.length} students)
          </h2>
          <p className="text-xs text-slate-400 mt-1">Sorted by due amount — highest first. Hover a row to see rank!</p>
        </div>

        {students.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-3">📋</span>
            <p className="text-slate-400 font-medium">No data for this month</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider w-10">#</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Room</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Meals</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Total Bill</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Paid</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Due</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s: any) => {
                  const isTop3 = s.rank <= 3;
                  const isHighDue = s.due > 0;
                  const showHoverRank = hoveredRank === s.rank;

                  return (
                    <tr key={s.student_id}
                      onMouseEnter={() => setHoveredRank(s.rank)}
                      onMouseLeave={() => setHoveredRank(null)}
                      className={`border-b border-slate-50 transition-all duration-150 cursor-default ${
                        isTop3 && isHighDue
                          ? rankColors[s.rank - 1] + ' hover:bg-opacity-80'
                          : isHighDue
                            ? 'bg-rose-50/30 hover:bg-rose-50/60'
                            : 'hover:bg-slate-50/50'
                      }`}>
                      <td className="px-4 py-3.5 relative">
                        <div className="flex items-center gap-1.5">
                          {isTop3 && isHighDue ? (
                            <span className="text-lg">{rankEmojis[s.rank - 1]}</span>
                          ) : (
                            <span className="text-xs text-slate-400 font-mono">{s.rank}</span>
                          )}
                          {showHoverRank && (
                            <span className="absolute -top-1 left-8 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap z-10 shadow-lg">
                              #{s.rank} place
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-medium text-slate-800">{s.name}</span>
                        {isTop3 && isHighDue && (
                          <span className={`ml-2 inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${rankBadgeColors[s.rank - 1]}`}>
                            {s.rank === 1 ? '🏆 Winner' : s.rank === 2 ? 'Runner-Up' : '3rd'}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500">{s.room_number}</td>
                      <td className="px-4 py-3.5 text-center text-slate-600">{s.total_meals}</td>
                      <td className="px-4 py-3.5 text-right font-medium text-slate-700">৳{Number(s.total_amount).toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-right font-medium text-emerald-600">৳{Number(s.paid).toLocaleString()}</td>
                      <td className="px-4 py-3.5 text-right">
                        <span className={`font-bold ${s.due > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {s.due > 0 ? `৳${Number(s.due).toLocaleString()}` : '✓'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 md:p-6 border border-amber-200">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🎮</span>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-slate-800">How the Game Works</h3>
            <ul className="text-xs md:text-sm text-slate-600 mt-2 space-y-1.5 list-disc list-inside">
              <li><strong>🥇 Top Due = Funny Winner</strong> — The student with the highest unpaid bill wins the crown (and shame) 🫣</li>
              <li><strong>📈 Rank = Position</strong> — Higher due means higher rank. Simple math!</li>
              <li><strong>⏰ Month End Showdown</strong> — At month end, the leaderboard freezes and the winner is declared</li>
              <li><strong>💡 Pro Tip</strong> — Pay your dues to dodge the crown and let someone else be the Funny Winner next month!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
