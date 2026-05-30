import { Link } from "react-router-dom"
import {
  IconLanguage,
  IconShieldCheck,
  IconDeviceMobile,
} from "@tabler/icons-react"

function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Dark Noise Colored Background */}
      <div className="absolute inset-0 z-0 bg-noise" />

      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-zinc-500/5 blur-[120px] animate-pulse-glow z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-slate-500/5 blur-[100px] animate-pulse-glow delay-500 z-0" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-neutral-500/5 blur-[80px] animate-pulse-glow delay-300 z-0" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-6">
          <div className="flex items-center gap-2">
            <span className="font-heading font-semibold text-lg text-white">
              Vitto
            </span>
          </div>
        </nav>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
          {/* Heading */}
          <h1 className="animate-fade-in-up opacity-0 delay-100 max-w-4xl font-heading font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight leading-[1.1]">
            <span className="text-white">Loans without</span>
            <br />
            <span className="text-gradient">barriers</span>
          </h1>

          {/* Subheading */}
          <p className="animate-fade-in-up opacity-0 delay-200 mt-6 max-w-xl text-base md:text-lg text-white/40 leading-relaxed">
            Helping local-language borrowers complete KYC, apply for loans, and
            repay all without typing. One portal for agents, one voice for
            borrowers.
          </p>

          {/* CTA */}
          <div className="animate-fade-in-up opacity-0 delay-300 mt-10 flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/apply"
              className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-sm text-black bg-white hover:bg-white/90 transition-all duration-300 shadow-lg shadow-white/10 hover:shadow-white/20"
            >
              Apply for a Loan
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-sm text-white/70 border border-white/10 hover:border-white/20 hover:text-white hover:bg-white/5 transition-all duration-300"
            >
              Open Dashboard
            </Link>
          </div>

          {/* Feature pills */}
          <div className="animate-fade-in-up opacity-0 delay-500 mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
            <FeatureCard
              icon={<IconLanguage size={20} className="text-zinc-400" />}
              title="Multi-Language"
              description="Hindi, Tamil, Telugu, Marathi & English"
            />
            <FeatureCard
              icon={<IconDeviceMobile size={20} className="text-zinc-400" />}
              title="Mobile-First"
              description="Built for field agents on phones"
            />
            <FeatureCard
              icon={<IconShieldCheck size={20} className="text-zinc-400" />}
              title="Instant Tracking"
              description="Real-time application status updates"
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-6 md:px-12 py-6 text-center">
          <p className="text-xs text-white/20">
            © {new Date().getFullYear()} Vitto · Inclusive FinTech
          </p>
        </footer>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="glass-card glass-card-hover rounded-xl px-5 py-4 text-left">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium text-white">{title}</span>
      </div>
      <p className="text-xs text-white/40 leading-relaxed">{description}</p>
    </div>
  )
}

export default LandingPage
