import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PageHeader from '../../components/common/PageHeader';
import { pushAlert } from '../../redux/features/alerts/alertsSlice';
import { operationsService } from '../../services/operationsService';

const fallbackAlerts = [
  { id: 'alert-1', title: 'High rainfall warning', message: 'Avoid low-lying routes.', severity: 'danger', region: 'East Bank corridor' },
  { id: 'alert-2', title: 'Shelter intake notice', message: 'Central High School has capacity.', severity: 'info', region: 'Central zone' }
];

export default function AlertsPage() {
  const dispatch = useDispatch();
  const [alerts, setAlerts] = useState(fallbackAlerts);
  const [form, setForm] = useState({ title: '', message: '', severity: 'warning', region: '' });

  useEffect(() => {
    operationsService.listAlerts().then((response) => setAlerts(response.data.data)).catch(() => setAlerts(fallbackAlerts));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = { ...form, audience: ['victim', 'helper', 'authority', 'admin'] };
    const localAlert = { ...payload, id: crypto.randomUUID() };
    setAlerts((current) => [localAlert, ...current]);
    dispatch(pushAlert(localAlert));
    operationsService.publishAlert(payload).catch(() => null);
    setForm({ title: '', message: '', severity: 'warning', region: '' });
  };

  return (
    <>
      <PageHeader title="Emergency Alerts" description="Publish targeted warnings with severity levels, banners, and real-time notifications." />
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <form className="rounded-lg border border-slate-200 bg-white p-5" onSubmit={handleSubmit}>
          <h3 className="font-bold text-slate-950">Alert Composer</h3>
          <div className="mt-4 space-y-3">
            {['title', 'region'].map((field) => (
              <input
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                key={field}
                onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))}
                placeholder={field}
                required={field === 'title'}
                value={form[field]}
              />
            ))}
            <select className="w-full rounded-md border border-slate-300 px-3 py-2" onChange={(event) => setForm((current) => ({ ...current, severity: event.target.value }))} value={form.severity}>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
              <option value="critical">Critical</option>
            </select>
            <textarea className="min-h-28 w-full rounded-md border border-slate-300 px-3 py-2" onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))} placeholder="Warning message" required value={form.message} />
            <button className="w-full rounded-md bg-aegis-danger px-4 py-2 font-bold text-white" type="submit">Publish Alert</button>
          </div>
        </form>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <article className="rounded-lg border border-slate-200 bg-white p-4" key={alert.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-950">{alert.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{alert.message}</p>
                  <p className="mt-2 text-xs text-slate-500">{alert.region}</p>
                </div>
                <span className="rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">{alert.severity}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
