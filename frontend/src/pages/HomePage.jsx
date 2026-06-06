import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import {
  AlertTriangle, Bot, Brain, Map, MessageCircle,
  Radio, Shield, Siren, Users, Warehouse, Zap
} from 'lucide-react';

const features = [
  { icon: Siren,          title: 'SOS Emergency System',      desc: 'One-tap panic alerts with real-time authority notifications and location sharing.' },
  { icon: Map,            title: 'Live Disaster Maps',         desc: 'Interactive maps with danger zones, safe corridors, shelter markers, and helper tracking.' },
  { icon: Brain,          title: 'AI Risk Prediction',         desc: 'Simulated disaster scoring from rainfall, wind, and seismic intelligence data.' },
  { icon: MessageCircle,  title: 'Real-Time Chat',             desc: 'Encrypted room-based messaging between victims, helpers, and authorities.' },
  { icon: Warehouse,      title: 'Smart Shelter Tracking',     desc: 'Live occupancy, food stock, and medical supply levels for every evacuation center.' },
  { icon: Bot,            title: 'AI Emergency Chatbot',       desc: 'Instant survival guidance for floods, fires, and earthquakes — no login required.' },
  { icon: Radio,          title: 'Live Alert Broadcast',       desc: 'Push emergency alerts with severity levels to all registered responders.' },
  { icon: Users,          title: 'Missing Persons Registry',   desc: 'File and search missing person reports with status tracking during disasters.' },
];

const roles = [
  { role: 'Victim',    color: 'from-red-500 to-rose-600',     desc: 'Send SOS, find shelters, track rescue status.' },
  { role: 'Helper',    color: 'from-teal-500 to-emerald-600', desc: 'Coordinate resources, track assignments, volunteer.' },
  { role: 'Authority', color: 'from-indigo-500 to-violet-600', desc: 'Command operations, manage alerts, analyze incidents.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* ── HERO ── */}
      <header className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center sm:px-6">
        {/* background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-red-600/5 blur-3xl pointer-events-none" />

        {/* top nav */}
        <nav className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between gap-3 px-4 py-5 sm:px-8">
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="h-9 w-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="text-white h-5 w-5" />
            </div>
            <span className="text-lg font-black tracking-wide text-white sm:text-xl">AEGIS</span>
          </div>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Link
              to={ROUTES.LOGIN}
              className="px-2 py-2 text-sm font-semibold text-slate-300 transition-colors hover:text-white sm:px-4"
            >
              Sign In
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-bold shadow-lg transition-colors hover:bg-indigo-500 sm:px-4"
            >
              Get Access
            </Link>
          </div>
        </nav>

        {/* hero content */}
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
              Next-Gen Disaster Intelligence System
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl md:text-8xl md:leading-none">
            <span className="text-white">Rescue. </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Respond. </span>
            <span className="text-white">Recover.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-base leading-relaxed text-slate-400 md:text-xl">
            Aegis is a real-time disaster management command platform. Coordinate SOS, map danger zones, 
            manage shelters, dispatch rescue teams, and run AI-powered risk analysis — all in one workspace.
          </p>

          <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Link
              to={ROUTES.REGISTER}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-base font-bold shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105 hover:bg-indigo-500 sm:px-8 sm:text-lg"
            >
              <Zap className="h-5 w-5" />
              Launch Platform
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-base font-semibold transition-all hover:bg-white/10 sm:px-8 sm:text-lg"
            >
              Sign In
            </Link>
          </div>

          {/* stats strip */}
          <div className="mx-auto mt-12 grid max-w-lg grid-cols-1 gap-4 text-center sm:mt-16 sm:grid-cols-3 sm:gap-6">
            {[
              { value: 'Real-Time', label: 'SOS Alerts' },
              { value: 'AI-Powered', label: 'Risk Scoring' },
              { value: 'Live', label: 'Rescue Tracking' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] uppercase tracking-widest text-slate-500">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-slate-500 to-transparent" />
        </div>
      </header>

      {/* ── ROLES ── */}
      <section className="bg-slate-900/50 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto mb-10 max-w-5xl text-center sm:mb-14">
          <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-3">Role-Based Access</p>
          <h2 className="text-3xl font-black text-white sm:text-4xl">One platform, three command roles</h2>
        </div>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <div
              key={r.role}
              className="rounded-2xl border border-white/5 bg-white/5 p-8 hover:bg-white/10 transition-all group"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <Shield className="text-white h-7 w-7" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">{r.role}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto mb-10 max-w-5xl text-center sm:mb-14">
          <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-3">Platform Capabilities</p>
          <h2 className="text-3xl font-black text-white sm:text-4xl">Everything you need in a crisis</h2>
        </div>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 hover:bg-white/[0.07] hover:border-indigo-500/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center mb-4 group-hover:bg-indigo-600/30 transition-colors">
                <f.icon className="text-indigo-400 h-5 w-5" />
              </div>
              <h3 className="font-bold text-white text-sm mb-2">{f.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-3xl rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/20 to-violet-600/10 p-6 text-center sm:p-10 lg:p-16">
          <AlertTriangle className="h-12 w-12 text-indigo-400 mx-auto mb-6" />
          <h2 className="mb-4 text-3xl font-black text-white sm:text-4xl">Every second matters.</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Join the platform built for real-world disaster response. Activate now and coordinate the rescue.
          </p>
          <Link
            to={ROUTES.REGISTER}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-base font-bold shadow-2xl shadow-indigo-600/30 transition-all hover:scale-105 hover:bg-indigo-500 sm:w-auto sm:px-10 sm:text-lg"
          >
            <Zap className="h-5 w-5" />
            Activate Aegis
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-6 text-center text-slate-600 text-xs">
        <p>© {new Date().getFullYear()} AEGIS Disaster Intelligence Platform · Built for life-critical operations</p>
      </footer>
    </div>
  );
}
