import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const menuItems: Record<string, { label: string; path: string; icon: string }[]> = {
  super_admin: [
    { label: 'Users', path: '/dashboard/super-admin/users', icon: '👥' },
    { label: 'Settings', path: '/dashboard/super-admin/settings', icon: '⚙️' },
    { label: 'Roles', path: '/dashboard/super-admin/roles', icon: '🔐' },
    { label: 'Backups', path: '/dashboard/super-admin/backups', icon: '💾' },
    { label: 'Notices', path: '/dashboard/notices', icon: '📢' },
    { label: 'Profile', path: '/dashboard/profile', icon: '👤' },
  ],
  hall_tutor: [
    { label: 'Dashboard', path: '/dashboard/hall-tutor', icon: '📊' },
    { label: 'Approvals', path: '/dashboard/hall-tutor/approvals', icon: '✅' },
    { label: 'Reports', path: '/dashboard/hall-tutor/reports', icon: '📋' },
    { label: 'Income vs Expenses', path: '/dashboard/hall-tutor/income-expenses', icon: '💰' },
    { label: 'Due Students', path: '/dashboard/hall-tutor/due-students', icon: '⚠️' },
    { label: 'Notices', path: '/dashboard/notices', icon: '📢' },
    { label: 'Profile', path: '/dashboard/profile', icon: '👤' },
  ],
  manager: [
    { label: 'Dashboard', path: '/dashboard/manager', icon: '📊' },
    { label: 'Menus', path: '/dashboard/manager/menus', icon: '📋' },
    { label: 'Expenses', path: '/dashboard/manager/expenses', icon: '💸' },
    { label: 'Attendance', path: '/dashboard/manager/attendance', icon: '✅' },
    { label: 'Payments', path: '/dashboard/manager/payments', icon: '💳' },
    { label: 'Students', path: '/dashboard/manager/students', icon: '👨‍🎓' },
    { label: 'Reports', path: '/dashboard/manager/reports', icon: '📊' },
    { label: 'Notices', path: '/dashboard/notices', icon: '📢' },
    { label: 'Profile', path: '/dashboard/profile', icon: '👤' },
  ],
  student: [
    { label: 'Dashboard', path: '/dashboard/student', icon: '🏠' },
    { label: 'Menu', path: '/dashboard/student/menu', icon: '🍽️' },
    { label: 'My Meals', path: '/dashboard/student/meals', icon: '🍳' },
    { label: 'Payments', path: '/dashboard/student/payments', icon: '💳' },
    { label: 'Wallet', path: '/dashboard/student/wallet', icon: '👛' },
    { label: 'Due List', path: '/dashboard/student/due-list', icon: '⚠️' },
    { label: 'Notices', path: '/dashboard/notices', icon: '📢' },
    { label: 'Profile', path: '/dashboard/profile', icon: '👤' },
  ],
};

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const role = user?.role || 'student';
  const items = menuItems[role] || menuItems.student;

  return (
    <aside className="bg-slate-800 text-white h-full flex flex-col">
      <div className="text-lg md:text-xl font-bold mb-6 px-4 pt-4 flex items-center gap-2.5">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">HM</span>
        <span>HMEMS</span>
      </div>
      <nav className="flex-1 space-y-0.5 px-2 pb-4">
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === `/dashboard/${role}` || item.path === '/dashboard/notices' || item.path === '/dashboard/profile'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                isActive
                  ? 'bg-slate-700/80 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/40'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}