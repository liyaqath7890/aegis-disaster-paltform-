import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AlertTriangle, Bell, Radio, ShieldAlert, Trash2, Plus, X } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { pushAlert } from '../../redux/features/alerts/alertsSlice';
import { operationsService } from '../../services/operationsService';

const SEVERITY = {
  info:     { label: 'Info',     bg: 'bg-blue-100  text-blue-700',   bar: 'bg-blue-400'   },
  warning:  { label: 'Warning',  bg: 'bg-amber-100 text-amber-700',  bar: 'bg-amber-400'  },
  danger:   { label: 'Danger',   bg: 'bg-red-100   text-red-700',    bar: 'bg-red-500'    },
  critical: { label: 'Critical', bg: 'bg-rose-200  text-rose-800',   bar: 'bg-rose-600'   },
};

const FALLBACK = [
  { id: 'a1', title: 'High rainfall warning',      message: 'Avoid low-lying routes and flooded areas.',      severity: 'danger',   region: 'East Bank corridor', audience: ['victim'] },
  { id: 'a2', title: 'Shelter intake notice',      message: 'Central High School has remaining capacity.',     severity: 'info',     region: 'Central zone',       audience: ['victim', 'helper'] },
  { id: 'a3', title: 'Rescue team mobilisation',   message: 'Teams dispatched to Ward 4 residential sector.',  severity: 'warning',  region: 'Ward 4',             audience: ['helper', 'authority'] },
];

const EMPTY = { title: '', message: '', severity: 'warning', region: '', audience: ['victim', 'helper', 'authority', 'admin'] };
const AUDIENCES = ['victim', 'helper', 'authority', 'admin'];

export default function AlertsPage() {
  const dispatch = useDispatch();
  const [alerts, setAlerts] = useState(FALLBACK);
  const [form, setForm]     = useState(EMPTY);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    operationsService.listAlerts()
      .then((r) => setAlerts(r.data.data))
      .catch(() => setAlerts(FALLBACK));
  }, []);

  const toggleAudience = (role) =>
    setForm((f) => ({
      ...f,
      audience: f.audience.includes(role) ? f.audience.filter((r) => r !== role) : [...f.audience, role],
    }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const local = { ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setAlerts((prev) => [local, ...prev]);
    dispatch(pushAlert(local));
    operationsService.publishAlert(form).catch(() => null);
    setForm(EMPTY);
  };

  const handleDelete = (id) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const visible = filter === 'all' ? alerts : alerts.filter((a) => a.severity === filter);

  const counts = {
    critical: alerts.filter((a) => a.severity === 'critical').length,
    danger:   alerts.filter((a) => a.severity === 'danger').length,
    warning:  alerts.filter((a) => a.severity === 'warning').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Emergency Alerts" description="Publish targeted warnings with severity levels and real-time notifications." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={ShieldAlert}   label="Critical Alerts" value={String(counts.critical)} helper="Require immediate action" tone="danger" />
        <StatCard icon={AlertTriangle} label="Danger Warnings"  value={String(counts.danger)}   helper="High-risk advisories"    tone="amber"  />
        <StatCard icon={Bell}          label="All Active"       value={String(alerts.length)}   helper="Across all regions"                   />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        {/* Composer */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 h-fit">
          <div className="flex items-center gap-2 mb-1">
            <Radio className="h-5 w-5 text-indigo-600" />
            <h3 className="font-black text-slate-900">Alert Composer</h3>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Title *</label>
            <input
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. Flash flood warning"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Region</label>
            <input
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="e.g. North sector"
              value={form.region}
              onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Severity</label>
            <div className="grid grid-cols-4 gap-2">
              {Object.keys(SEVERITY).map((s) => (
                <button
                  key={s} type="button"
                  onClick={() => setForm((f) => ({ ...f, severity: s }))}
                  className={`py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                    form.severity === s
                      ? `${SEVERITY[s].bg} border-current scale-105`
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Message *</label>
            <textarea
              required
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              placeholder="Describe the situation and required action…"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Audience</label>
            <div className="flex flex-wrap gap-2">
              {AUDIENCES.map((role) => (
                <button
                  key={role} type="button"
                  onClick={() => toggleAudience(role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    form.audience.includes(role)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-red-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Publish Alert
          </button>
        </form>

        {/* Feed */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            {['all', ...Object.keys(SEVERITY)].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  filter === s
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s} {s !== 'all' && `(${alerts.filter((a) => a.severity === s).length})`}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <Bell className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-slate-500 text-sm">No alerts in this category.</p>
            </div>
          ) : (
            visible.map((alert) => {
              const cfg = SEVERITY[alert.severity] || SEVERITY.warning;
              return (
                <article key={alert.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                  <div className={`h-1 ${cfg.bar}`} />
                  <div className="p-4 flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm">{alert.title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${cfg.bg}`}>{cfg.label}</span>
                      </div>
                      <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{alert.message}</p>
                      {alert.region && (
                        <p className="mt-2 text-xs text-slate-400 font-semibold">📍 {alert.region}</p>
                      )}
                      {alert.audience?.length > 0 && (
                        <div className="mt-2 flex gap-1.5 flex-wrap">
                          {alert.audience.map((role) => (
                            <span key={role} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500 capitalize">{role}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
