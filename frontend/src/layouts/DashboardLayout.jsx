import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  CloudUpload,
  Home,
  LifeBuoy,
  LogOut,
  Map,
  Menu,
  MessageCircle,
  Package,
  Plane,
  Search,
  Shield,
  Siren,
  Users,
  Warehouse,
  X
} from 'lucide-react';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';
import { ROLE_LABELS, canAccessRoute, normalizeRole } from '../constants/roleAccess';
import { logout } from '../redux/features/auth/authSlice';

const links = [
  { label: 'Victim', to: ROUTES.VICTIM_DASHBOARD, icon: Home },
  { label: 'Authority', to: ROUTES.ADMIN_DASHBOARD, icon: Shield },
  { label: 'Helper', to: ROUTES.HELPER_DASHBOARD, icon: LifeBuoy },
  { label: 'SOS', to: ROUTES.SOS, icon: Siren },
  { label: 'Map', to: ROUTES.MAPS, icon: Map },
  { label: 'Chat', to: ROUTES.CHAT, icon: MessageCircle },
  { label: 'Shelters', to: ROUTES.SHELTERS, icon: Warehouse },
  { label: 'Missing', to: ROUTES.MISSING_PERSONS, icon: Search },
  { label: 'Resources', to: ROUTES.RESOURCES, icon: Package },
  { label: 'Analytics', to: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: 'Alerts', to: ROUTES.ALERTS, icon: AlertTriangle },
  { label: 'AI', to: ROUTES.AI, icon: Bot },
  { label: 'Drone', to: ROUTES.DRONE, icon: Plane },
  { label: 'Uploads', to: ROUTES.UPLOADS, icon: CloudUpload }
];

export default function DashboardLayout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const role = normalizeRole(user?.role);
  const roleLabel = ROLE_LABELS[role] || 'Responder';
  const visibleLinks = links.filter((link) => canAccessRoute(role, link.to));

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar links={visibleLinks} onLogout={() => dispatch(logout())} roleLabel={roleLabel} user={user} />

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" onClick={() => setIsMobileOpen(false)}>
          <div className="h-full w-72 bg-white p-5" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-center justify-between">
              <Brand />
              <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100" onClick={() => setIsMobileOpen(false)} type="button">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavItems links={visibleLinks} onNavigate={() => setIsMobileOpen(false)} />
          </div>
        </div>
      )}

      <section className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden" onClick={() => setIsMobileOpen(true)} type="button">
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <p className="text-sm font-semibold text-slate-950">Disaster response command workspace</p>
                <p className="text-xs text-slate-500">Live operations - Secure session - {roleLabel}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative rounded-md border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50" type="button">
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-600" />
              </button>
              <div className="hidden rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-right sm:block">
                <p className="text-sm font-semibold text-slate-900">{user?.name || 'Responder'}</p>
                <p className="text-xs text-slate-500">{roleLabel}</p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </section>
    </div>
  );
}

function Sidebar({ links, onLogout, roleLabel, user }) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white p-5 lg:flex lg:flex-col">
      <Brand />
      
      <div className="flex-1 overflow-y-auto mt-6 pr-2 -mr-2 custom-scrollbar">
        <div className="mb-5 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0) || 'R'}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{user?.name || 'Responder'}</p>
              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{roleLabel || 'Secure session'}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-slate-900">
            <LifeBuoy className="h-4 w-4 text-indigo-600" />
            <span className="font-semibold">Quick help</span>
          </div>
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">How AEGIS works</p>
          <ul className="space-y-2 text-xs leading-5">
            <li className="rounded-xl bg-white p-3">Register and login to start using the dashboard.</li>
            <li className="rounded-xl bg-white p-3">Victims can send SOS, track shelters, and get alerts.</li>
            <li className="rounded-xl bg-white p-3">Helpers coordinate resources, accept missions, and update availability.</li>
            <li className="rounded-xl bg-white p-3">Authorities review alerts, analytics, and manage field response.</li>
          </ul>
        </div>

        {normalizeRole(user?.role) === ROLES.VICTIM && (
          <NavLink 
            to={ROUTES.SOS}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl bg-red-600 px-4 py-3.5 text-sm font-black text-white shadow-lg shadow-red-200 hover:bg-red-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Siren className="h-5 w-5 animate-pulse" />
            PANIC / SEND SOS
          </NavLink>
        )}

        <NavItems links={links} />
      </div>

      <div className="pt-4 mt-auto border-t border-slate-100">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-red-600 hover:border-red-100 transition-all"
          onClick={onLogout}
          type="button"
        >
          <LogOut className="h-4 w-4" />
          Terminate Session
        </button>
      </div>
    </aside>
  );
}

function Brand() {
  return (
    <div className="flex items-center gap-3 px-1">
      <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
        <Shield className="text-white h-6 w-6" />
      </div>
      <div>
        <h1 className="text-2xl font-black text-slate-900 leading-none">AEGIS</h1>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-600">Disaster Intel</p>
      </div>
    </div>
  );
}

function NavItems({ links, onNavigate }) {
  return (
    <nav className="mt-2 space-y-0.5">
      {links.map(({ icon: Icon, label, to }) => (
        <NavLink
          key={to}
          onClick={onNavigate}
          to={to}
          className={({ isActive }) =>
            `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
              isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                isActive ? 'bg-white/20' : 'bg-slate-100 group-hover:bg-slate-200'
              }`}>
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
              </div>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
