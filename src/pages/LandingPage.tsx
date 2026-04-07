import AboutSection from '../components/landing/AboutSection'
import ContactFooter from '../components/landing/ContactFooter'
import HeroSection from '../components/landing/HeroSection'
import LandingHeader from '../components/landing/LandingHeader'
import ReadyToStartSection from '../components/landing/ReadyToStartSection'
import ServicesSection from '../components/landing/ServicesSection'

export default function LandingPage() {
  return (
    <div dir="rtl" className="min-h-screen bg-offwhite font-cairo text-body">
      <LandingHeader />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <ReadyToStartSection />
      <ContactFooter />
    </div>
  )
}
