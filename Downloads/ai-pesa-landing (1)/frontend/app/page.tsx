import Hero from "@/frontend/components/Hero"
import Features from "@/frontend/components/Features"
import HowItWorks from "@/frontend/components/HowItWorks"
import TillAgentIntegration from "@/frontend/components/TillAgentIntegration"
import Pricing from "@/frontend/components/Pricing"
import Testimonials from "@/frontend/components/Testimonials"
import CallToAction from "@/frontend/components/CallToAction"
import Chatbot from "@/frontend/components/Chatbot"
import ThemeToggle from "@/frontend/components/ThemeToggle"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between relative">
      <ThemeToggle />
      <Hero />
      <Features />
      <HowItWorks />
      <TillAgentIntegration />
      <Pricing />
      <Testimonials />
      <CallToAction />
      <Chatbot />
    </main>
  )
}

