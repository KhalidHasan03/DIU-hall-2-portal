import { useState, useEffect } from 'react';
import api from '../../lib/axios';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function TutorApprovalsPage() {
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = () => {
    setLoading(true);
    api.get('/hall-tutor/students/pending').then(({ data }) => {
      setPendingStudents(Array.isArray(data) ? data : []);
    }).catch(() => {
      toast.error('Failed to load pending students');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPending(); }, []);

  const handleApprove = async (student: any) => {
    try {
      await api.post(`/hall-tutor/students/${student.id}/approve`);
      toast.success(`${student.user?.name} approved!`);
      fetchPending();
    } catch {
      toast.error('Failed to approve');
    }
  };

  const handleReject = async (student: any) => {
    const reason = prompt('Reason for rejection (optional):');
    if (reason === null) return;
    try {
      await api.post(`/hall-tutor/students/${student.id}/reject`, { reason });
      toast.success(`${student.user?.name} rejected.`);
      fetchPending();
    } catch {
      toast.error('Failed to reject');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><LoadingSpinner /></div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative">
          <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Hall Tutor</p>
          <h1 className="text-xl md:text-3xl font-bold text-white mt-1">Student Approvals</h1>
          <p className="text-white/70 text-xs md:text-sm mt-1">Review and approve new student registrations for DIU Hall-2.</p>
        </div>
      </div>

      {pendingStudents.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 md:p-16 text-center border border-dashed border-slate-200">
          <span className="text-4xl md:text-5xl block mb-3 md:mb-4">✅</span>
          <p className="text-sm md:text-lg text-slate-400 font-medium">No pending approvals</p>
          <p className="text-xs md:text-sm text-slate-300 mt-1">All student registrations have been processed.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm md:text-base">
              Pending Approvals <span className="text-amber-500 font-bold">({pendingStudents.length})</span>
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Floor/Room</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Department</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Contact</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingStudents.map((s: any) => (
                  <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5 text-slate-700 font-medium">{s.user?.name}</td>
                    <td className="px-4 py-3.5 text-slate-500">{s.user?.email}</td>
                    <td className="px-4 py-3.5 text-slate-600">{s.room_number}</td>
                    <td className="px-4 py-3.5 text-slate-600">{s.department}</td>
                    <td className="px-4 py-3.5 text-slate-600">{s.user?.phone || s.emergency_contact || '-'}</td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleApprove(s)}
                          className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-medium hover:bg-emerald-600 transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleReject(s)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors"
                        >
                          ✕ Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
