import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';

import StudentDashboard from '../pages/student/Dashboard';
import StudentMenuPage from '../pages/student/MenuPage';
import StudentMealsPage from '../pages/student/MealsPage';
import StudentPaymentsPage from '../pages/student/PaymentsPage';
import StudentWalletPage from '../pages/student/WalletPage';
import StudentDueListPage from '../pages/student/DueListPage';

import ManagerDashboard from '../pages/manager/Dashboard';
import ManagerMenusPage from '../pages/manager/MenusPage';
import ManagerExpensesPage from '../pages/manager/ExpensesPage';
import ManagerPaymentsPage from '../pages/manager/PaymentsPage';
import ManagerAttendancePage from '../pages/manager/AttendancePage';
import ManagerStudentsPage from '../pages/manager/StudentsPage';
import ManagerReportsPage from '../pages/manager/ReportsPage';

import TutorDashboard from '../pages/hall-tutor/Dashboard';
import TutorApprovalsPage from '../pages/hall-tutor/ApprovalsPage';
import TutorReportsPage from '../pages/hall-tutor/ReportsPage';
import TutorIncomeExpensePage from '../pages/hall-tutor/IncomeExpensePage';
import TutorDueListPage from '../pages/hall-tutor/DueListPage';

import AdminUsersPage from '../pages/super-admin/UsersPage';
import AdminSettingsPage from '../pages/super-admin/SettingsPage';
import AdminBackupsPage from '../pages/super-admin/BackupsPage';
import AdminRolesPage from '../pages/super-admin/RolesPage';

import NoticesPage from '../pages/shared/NoticesPage';
import ProfilePage from '../pages/shared/ProfilePage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RoleRedirect />} />
          <Route path="student/*" element={<StudentRoutes />} />
          <Route path="manager/*" element={<ManagerRoutes />} />
          <Route path="hall-tutor/*" element={<TutorRoutes />} />
          <Route path="super-admin/*" element={<AdminRoutes />} />
          <Route path="notices" element={<NoticesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function RoleRedirect() {
  const role = JSON.parse(localStorage.getItem('user') || '{}')?.role || 'student';
  const path: Record<string, string> = {
    super_admin: '/dashboard/super-admin',
    hall_tutor: '/dashboard/hall-tutor',
    manager: '/dashboard/manager',
    student: '/dashboard/student',
  };
  return <Navigate to={path[role] || '/dashboard/student'} replace />;
}

function StudentRoutes() {
  return (
    <Routes>
      <Route index element={<StudentDashboard />} />
      <Route path="menu" element={<StudentMenuPage />} />
      <Route path="meals" element={<StudentMealsPage />} />
      <Route path="payments" element={<StudentPaymentsPage />} />
      <Route path="wallet" element={<StudentWalletPage />} />
      <Route path="due-list" element={<StudentDueListPage />} />
    </Routes>
  );
}

function ManagerRoutes() {
  return (
    <Routes>
      <Route index element={<ManagerDashboard />} />
      <Route path="menus" element={<ManagerMenusPage />} />
      <Route path="expenses" element={<ManagerExpensesPage />} />
      <Route path="attendance" element={<ManagerAttendancePage />} />
      <Route path="payments" element={<ManagerPaymentsPage />} />
      <Route path="students" element={<ManagerStudentsPage />} />
      <Route path="reports" element={<ManagerReportsPage />} />
    </Routes>
  );
}

function TutorRoutes() {
  return (
    <Routes>
      <Route index element={<TutorDashboard />} />
      <Route path="approvals" element={<TutorApprovalsPage />} />
      <Route path="reports" element={<TutorReportsPage />} />
      <Route path="income-expenses" element={<TutorIncomeExpensePage />} />
      <Route path="due-students" element={<TutorDueListPage />} />
    </Routes>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Navigate to="users" replace />} />
      <Route path="users" element={<AdminUsersPage />} />
      <Route path="settings" element={<AdminSettingsPage />} />
      <Route path="backups" element={<AdminBackupsPage />} />
      <Route path="roles" element={<AdminRolesPage />} />
    </Routes>
  );
}