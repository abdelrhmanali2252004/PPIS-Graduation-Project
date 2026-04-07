import { useState } from 'react'
import AdminAnalysesSection from '../components/admin/AdminAnalysesSection'
import AdminHeader from '../components/admin/AdminHeader'
import AdminRequestsSection from '../components/admin/AdminRequestsSection'
import AdminSidebar, { type AdminTab } from '../components/admin/AdminSidebar'
import AdminTopBar from '../components/admin/AdminTopBar'
import AdminUsersSection from '../components/admin/AdminUsersSection'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>('users')

  return (
    <div dir="rtl" className="flex min-h-screen bg-offwhite font-cairo text-body">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        <AdminTopBar />
        <AdminHeader activeTab={activeTab} />

        {activeTab === 'users' && <AdminUsersSection />}
        {activeTab === 'requests' && <AdminRequestsSection />}
        {activeTab === 'analyses' && <AdminAnalysesSection />}
      </main>
    </div>
  )
}
