import { useState, useRef } from 'react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const roleMeta: Record<string, { icon: string; gradient: string; label: string }> = {
  student: { icon: '👨‍🎓', gradient: 'from-emerald-500 to-teal-600', label: 'Student' },
  manager: { icon: '👔', gradient: 'from-blue-500 to-indigo-600', label: 'Hall Manager' },
  hall_tutor: { icon: '📚', gradient: 'from-violet-500 to-purple-600', label: 'Hall Tutor' },
  super_admin: { icon: '🛡️', gradient: 'from-rose-500 to-pink-600', label: 'Administrator' },
};

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pwForm, setPwForm] = useState({ current_password: '', password: '', password_confirmation: '' });
  const [changingPw, setChangingPw] = useState(false);

  const role = user?.role || 'student';
  const meta = roleMeta[role] || roleMeta.student;
  const student = user?.student;

  const avatarUrl = user?.avatar_url || null;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/profile', { name, phone });
      setUser(data.user);
      toast.success('Profile updated!');
    } catch {
      toast.error('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await api.post('/profile/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUser(data.user);
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangingPw(true);
    try {
      await api.put('/password', pwForm);
      toast.success('Password changed!');
      setPwForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    } finally {
      setChangingPw(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br ${meta.gradient} p-6 md:p-8 shadow-xl`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-center gap-5 md:gap-7">
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="group relative w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden shrink-0 ring-4 ring-white/30 hover:ring-white/60 transition-all disabled:opacity-60"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-white/20 flex items-center justify-center text-3xl md:text-5xl text-white">
                {user?.name?.charAt(0)?.toUpperCase() || '👤'}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs font-medium bg-black/60 px-2 py-1 rounded-lg">
                {uploading ? '...' : '📷 Edit'}
              </span>
            </div>
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
          <div className="text-center sm:text-left">
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider">Profile</p>
            <h1 className="text-xl md:text-3xl font-bold text-white mt-0.5">{user?.name}</h1>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-medium">
                {meta.icon} {meta.label}
              </span>
              {student && (
                <>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 text-[11px]">
                    🆔 {student.student_id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white/90 text-[11px]">
                    🏠 Room {student.room_number}
                  </span>
                </>
              )}
            </div>
            <p className="text-white/60 text-xs mt-2">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleUpdate} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 space-y-5">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-indigo-500 rounded-full inline-block" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow"
                  placeholder="e.g. Shafi" />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Phone</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-shadow" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">Email</label>
              <input type="email" value={user?.email || ''} disabled
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-400 outline-none cursor-not-allowed" />
            </div>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>

          <form onSubmit={handleChangePassword} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100 space-y-5">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-5 bg-amber-500 rounded-full inline-block" />
              Change Password
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1.5">Current Password</label>
                <input type="password" value={pwForm.current_password} onChange={e => setPwForm({...pwForm, current_password: e.target.value})}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-shadow" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">New Password</label>
                  <input type="password" value={pwForm.password} onChange={e => setPwForm({...pwForm, password: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-shadow" minLength={8} required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Confirm Password</label>
                  <input type="password" value={pwForm.password_confirmation} onChange={e => setPwForm({...pwForm, password_confirmation: e.target.value})}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-shadow" minLength={8} required />
                </div>
              </div>
            </div>
            <button type="submit" disabled={changingPw}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50">
              {changingPw ? 'Changing...' : 'Update Password'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
            <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-sky-500 rounded-full inline-block" />
              Account Info
            </h2>
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50/70">
                <span className="text-xs text-slate-500">Role</span>
                <span className="text-xs font-semibold text-slate-700 capitalize">{meta.label}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50/70">
                <span className="text-xs text-slate-500">Status</span>
                <span className={`text-xs font-semibold ${user?.is_active ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {user?.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-sky-50/70">
                <span className="text-xs text-slate-500">Joined</span>
                <span className="text-xs font-semibold text-slate-700">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-BD', { month: 'short', year: 'numeric' }) : '—'}
                </span>
              </div>
            </div>
          </div>

          {student && (
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <span className="w-1 h-5 bg-emerald-500 rounded-full inline-block" />
                Student Details
              </h2>
              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70">
                  <span className="text-xs text-slate-500">Student ID</span>
                  <span className="text-xs font-semibold text-slate-700">{student.student_id}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70">
                  <span className="text-xs text-slate-500">Room</span>
                  <span className="text-xs font-semibold text-slate-700">{student.room_number}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70">
                  <span className="text-xs text-slate-500">Department</span>
                  <span className="text-xs font-semibold text-slate-700">{student.department}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70">
                  <span className="text-xs text-slate-500">Batch</span>
                  <span className="text-xs font-semibold text-slate-700">{student.batch || '—'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70">
                  <span className="text-xs text-slate-500">Emergency Contact</span>
                  <span className="text-xs font-semibold text-slate-700">{student.emergency_contact || '—'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70">
                  <span className="text-xs text-slate-500">Admission Date</span>
                  <span className="text-xs font-semibold text-slate-700">
                    {student.admission_date ? new Date(student.admission_date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70">
                  <span className="text-xs text-slate-500">Wallet</span>
                  <span className="text-xs font-semibold text-slate-700">
                    ৳{Number(student.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
