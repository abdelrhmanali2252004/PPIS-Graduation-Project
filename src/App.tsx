import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MarketResearchHub from './pages/MarketResearchHub'
import ProjectWizard from './pages/ProjectWizard'
import FeasibilityOutput from './pages/FeasibilityOutput'
import BrandingWizard from './pages/BrandingWizard'
import ExecutiveDashboard from './pages/ExecutiveDashboard'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/app/step1" element={<MarketResearchHub />} />
      <Route path="/app/step2" element={<ProjectWizard />} />
      <Route path="/app/step3" element={<FeasibilityOutput />} />
      <Route path="/app/step4" element={<BrandingWizard />} />
      <Route path="/app/step5" element={<Navigate to="/dashboard/user/projects" replace />} />
      <Route path="/dashboard/user" element={<Navigate to="/dashboard/user/projects" replace />} />
      <Route path="/dashboard/user/*" element={<ExecutiveDashboard />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
    </Routes>
  ) 
}
