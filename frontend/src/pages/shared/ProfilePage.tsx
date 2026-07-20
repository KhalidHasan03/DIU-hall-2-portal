import { useState } from 'react';
import api from '../../lib/axios';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/profile', { name, phone });
      setUser(data.user);
      toast.success('Profile updated!');
    } catch { toast.error('Error updating profile'); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-5 md:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-36 h-36 md:w-48 md:h-48 bg-white/10 rounded-full blur-2xl" />
        <div className="relative flex items-center gap-4 md:gap-6">
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-white/20 flex items-center justify-center text-2xl md:text-4xl text-white shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || '👤'}
          </div>
          <div>
            <p className="text-white/80 text-xs md:text-sm font-medium uppercase tracking-wider">Profile</p>
            <h1 className="text-xl md:text-3xl font-bold text-white mt-0.5">{user?.name}</h1>
            <p className="text-white/60 text-xs md:text-sm capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleUpdate} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Email</label>
          <input type="email" value={user?.email || ''} disabled className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm bg-slate-50 text-slate-500 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Full Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Phone</label>
          <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
        </div>
        <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-sm font-medium shadow-md">Update Profile</button>
      </form>
    </div>
  );
}