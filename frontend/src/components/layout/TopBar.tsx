import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin Panel',
    hall_tutor: 'Hall Tutor Dashboard',
    manager: 'Manager Dashboard',
    student: 'Student Portal',
  };

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 px-3 md:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <h1 className="text-base md:text-lg font-semibold text-slate-700 truncate">
          {roleLabels[user?.role || 'student']}
        </h1>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <span className="text-sm text-slate-600 hidden sm:block truncate max-w-[120px]">{user?.name}</span>
        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium capitalize hidden sm:block">
          {user?.role?.replace('_', ' ')}
        </span>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          <span className="hidden sm:block">Logout</span>
        </button>
      </div>
    </header>
  );
}