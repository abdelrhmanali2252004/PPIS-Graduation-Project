import { Navigate, Route, Routes } from 'react-router-dom'
import AdminHeader from '../components/admin/AdminHeader'
import AdminProjectsSection from '../components/admin/AdminProjectsSection'
import AdminProjectDashboardPage from './AdminProjectDashboardPage'
import AdminRequestsSection from '../components/admin/AdminRequestsSection'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminTopBar from '../components/admin/AdminTopBar'
import AdminUsersSection from '../components/admin/AdminUsersSection'
import ProfileSettingsPage from './ProfileSettingsPage'

export default function AdminDashboard() {
  return (
    <div dir="rtl" className="flex min-h-screen bg-offwhite font-cairo text-body">
      <AdminSidebar />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        <AdminTopBar />
        <AdminHeader />

        <Routes>
          <Route path="/" element={<Navigate to="users" replace />} />
          <Route path="users" element={<AdminUsersSection />} />
          <Route path="projects" element={<AdminProjectsSection />} />
          <Route path="projects/:projectId/dashboard" element={<AdminProjectDashboardPage />} />
          <Route path="requests" element={<AdminRequestsSection />} />
          <Route path="profile" element={<ProfileSettingsPage />} />
          <Route path="*" element={<Navigate to="users" replace />} />
        </Routes>
      </main>
    </div>
  )
}
