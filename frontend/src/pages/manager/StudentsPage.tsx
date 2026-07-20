import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ManagerStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', room_number: '' });

  const fetchStudents = () => {
    setLoading(true);
    api.get('/manager/students').then(({ data }) => setStudents(data.data || data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/manager/students', form);
      toast.success('Student added');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', room_number: '' });
      fetchStudents();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error adding student');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this student and their account?')) return;
    try {
      await api.delete(`/manager/students/${id}`);
      toast.success('Student deleted');
      fetchStudents();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Students</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Manage Students</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Add and manage hall students. Just name, email & floor.</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-lg shadow-indigo-200 hover:shadow-xl transition-all">
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="e.g. John Doe" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="student@example.com" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="Min 8 characters" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Floor / Room</label>
              <input type="text" value={form.room_number} onChange={e => setForm({...form, room_number: e.target.value})} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none" placeholder="e.g. 3rd Floor, Room 12" required />
            </div>
          </div>
          <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-md">Add Student</button>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800 text-sm md:text-base">All Students</h2>
        </div>
        {students.length === 0 ? (
          <div className="p-12 text-center">
            <span className="text-4xl block mb-3">👨‍🎓</span>
            <p className="text-slate-400 font-medium">No students added yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Floor / Room</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((s: any) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{s.user?.name}</td>
                    <td className="px-4 py-3.5 text-slate-500">{s.user?.email}</td>
                    <td className="px-4 py-3.5 text-slate-600">{s.room_number}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${s.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : s.status === 'pending' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Delete</button>
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