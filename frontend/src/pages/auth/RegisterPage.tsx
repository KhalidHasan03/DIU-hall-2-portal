import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    room_number: '', department: '', emergency_contact: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/register', form);
      setSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message
        || Object.values(err?.response?.data?.errors || {}).flat().join(', ')
        || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 p-4 relative">
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">✅</div>
              <h2 className="text-xl font-bold text-white">Registration Submitted!</h2>
              <p className="text-emerald-100 text-sm mt-1">DIU Hall-2 Membership</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-lg shrink-0 mt-0.5">📋</span>
                  <div>
                    <p className="text-sm font-medium text-emerald-800">What happens next?</p>
                    <ul className="text-xs text-emerald-700 mt-2 space-y-1.5">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 shrink-0">1.</span>
                        <span>Hall Tutor or Manager reviews your registration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 shrink-0">2.</span>
                        <span>Once approved, you can log in and book meals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-500 shrink-0">3.</span>
                        <span>Track meals, bills, and payments from your dashboard</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <Link
                to="/login"
                className="block w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium text-center hover:shadow-lg transition-all"
              >
                Go to Login
              </Link>
              <p className="text-xs text-slate-400 text-center">
                Registration reference: <strong className="text-slate-600">{form.email}</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-white/20 transition-all duration-300 ${success ? 'blur-sm pointer-events-none scale-[0.98]' : ''}`}>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold mx-auto mb-3 shadow-lg">HM</div>
          <h1 className="text-2xl font-bold text-slate-800">Student Registration</h1>
          <p className="text-slate-500 text-sm mt-1">DIU Hall-2 Membership</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. Shafi" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="student@example.com" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Phone / Contact</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="01XXXXXXXXX" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Min 8 characters" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Floor / Room Number</label>
              <input name="room_number" value={form.room_number} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. 3rd Floor, Room 12" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Department</label>
              <input name="department" value={form.department} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="e.g. CSE, EEE, BBA" required />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Emergency Contact (optional)</label>
            <input name="emergency_contact" value={form.emergency_contact} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" placeholder="Guardian phone number" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg disabled:opacity-50 transition-all text-sm font-medium">
            {loading ? 'Submitting...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-4">
          Already registered? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
