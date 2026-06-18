import { useEffect, useState } from 'react';
import { Search, Plus, X, UserX, Eye, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import { missingPersons as demoMissingPersons } from '../../constants/demoData';
import { operationsService } from '../../services/operationsService';

const STATUS_CONFIG = {
  missing:  { label: 'Missing',  color: 'bg-red-100 text-red-700',    icon: AlertCircle  },
  sighted:  { label: 'Sighted',  color: 'bg-amber-100 text-amber-700', icon: Eye          },
  found:    { label: 'Found',    color: 'bg-green-100 text-green-700', icon: CheckCircle  },
};

const EMPTY_FORM = { fullName: '', age: '', gender: 'Unknown', lastSeenAddress: '', description: '', status: 'missing' };

export default function MissingPersonsPage() {
  const [items, setItems]       = useState(demoMissingPersons);
  const [search, setSearch]     = useState('');
  const [filter, setFilter]     = useState('all');
  const [modalOpen, setModal]   = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);

  useEffect(() => {
    operationsService.listMissingPersons()
      .then((r) => setItems(r.data.data))
      .catch(() => setItems(demoMissingPersons));
  }, []);

  const filtered = items.filter((p) => {
    const matchSearch = p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.lastSeenLocation?.address?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    missing: items.filter((p) => p.status === 'missing').length,
    sighted: items.filter((p) => p.status === 'sighted').length,
    found:   items.filter((p) => p.status === 'found').length,
  };

  const openAdd = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ fullName: p.fullName, age: p.age || '', gender: p.gender || 'Unknown', lastSeenAddress: p.lastSeenLocation?.address || '', description: p.description || '', status: p.status });
    setModal(true);
  };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = (e) => {
    e.preventDefault();
    const entry = {
      ...form,
      age: Number(form.age) || null,
      lastSeenLocation: { address: form.lastSeenAddress },
    };
    if (editing) {
      const updated = { ...editing, ...entry };
      setItems((prev) => prev.map((p) => p.id === editing.id ? updated : p));
      operationsService.createMissingPerson && null; // patch if needed
    } else {
      const newEntry = { ...entry, id: crypto.randomUUID() };
      setItems((prev) => [newEntry, ...prev]);
      operationsService.createMissingPerson(entry).catch(() => null);
    }
    closeModal();
  };

  const cycleStatus = (person) => {
    const order = ['missing', 'sighted', 'found'];
    const next = order[(order.indexOf(person.status) + 1) % order.length];
    setItems((prev) => prev.map((p) => p.id === person.id ? { ...p, status: next } : p));
    operationsService.updateMissingPersonStatus?.(person.id, next).catch?.(() => null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this missing person report?')) {
      setItems((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageHeader
          title="Missing Person Tracking"
          description="Register reports, track sightings, and coordinate family reunification."
        />
        <button
          onClick={openAdd}
          className="shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Report Missing Person
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={AlertCircle}  label="Still Missing" value={String(counts.missing)} helper="Active search cases"        tone="danger" />
        <StatCard icon={Eye}          label="Sighted"        value={String(counts.sighted)} helper="Awaiting confirmation"     tone="amber"  />
        <StatCard icon={CheckCircle}  label="Found"          value={String(counts.found)}   helper="Successfully reunited"    tone="indigo" />
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search by name, description, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'missing', 'sighted', 'found'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === s
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
          <UserX className="mx-auto h-10 w-10 text-slate-300 mb-3" />
          <p className="text-slate-500 font-semibold">No reports match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((person) => {
            const cfg = STATUS_CONFIG[person.status] || STATUS_CONFIG.missing;
            const StatusIcon = cfg.icon;
            return (
              <article key={person.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-black text-lg shrink-0">
                      {person.fullName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{person.fullName}</h3>
                      <p className="text-xs text-slate-500">{person.age ? `Age ${person.age}` : 'Age unknown'} · {person.gender || 'Unknown'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => cycleStatus(person)}
                    title="Click to update status"
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity ${cfg.color}`}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {cfg.label}
                  </button>
                </div>

                {person.description && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">{person.description}</p>
                )}

                <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                  Last seen: {person.lastSeenLocation?.address || 'Unknown location'}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => openEdit(person)}
                    className="flex-1 rounded-xl border border-slate-200 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Edit Report
                  </button>
                  <button
                    onClick={() => handleDelete(person.id)}
                    className="rounded-xl border border-red-100 px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="bg-indigo-600 px-6 py-5 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{editing ? 'Update Report' : 'Register Missing Person'}</h3>
                <p className="text-xs text-indigo-200 mt-0.5">Fill in all known details for faster location</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Full Name *</label>
                <input
                  required
                  value={form.fullName}
                  onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Ravi Mehta"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Age</label>
                  <input
                    type="number" min="0" max="120"
                    value={form.age}
                    onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="42"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Gender</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm((f) => ({ ...f, gender: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option>Unknown</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Last Seen Location</label>
                <input
                  value={form.lastSeenAddress}
                  onChange={(e) => setForm((f) => ({ ...f, lastSeenAddress: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. East Bank sector, near bus stop"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Physical description, clothing, last activity…"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Current Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="missing">Missing</option>
                  <option value="sighted">Sighted</option>
                  <option value="found">Found</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {editing ? 'Save Changes' : 'Submit Report'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
