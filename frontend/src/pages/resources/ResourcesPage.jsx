import { useEffect, useState } from 'react';
import { Plus, X, Package, Droplets, Heart, Wrench, Truck, Search } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import AegisTable from '../../components/common/AegisTable';
import { resources as demoResources } from '../../constants/demoData';
import { operationsService } from '../../services/operationsService';

const CATEGORY_ICONS = {
  food: Package, water: Droplets, medical: Heart,
  equipment: Wrench, vehicle: Truck,
};

const STATUS_COLORS = {
  available: 'bg-green-100 text-green-700',
  reserved:  'bg-amber-100 text-amber-700',
  deployed:  'bg-blue-100  text-blue-700',
  depleted:  'bg-red-100   text-red-700',
};

const EMPTY = { name: '', category: 'food', quantity: '', unit: '', status: 'available' };

export default function ResourcesPage() {
  const [items, setItems]     = useState(demoResources);
  const [modal, setModal]     = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm]       = useState(EMPTY);
  const [search, setSearch]   = useState('');

  useEffect(() => {
    operationsService.listResources()
      .then((r) => setItems(r.data.data))
      .catch(() => setItems(demoResources));
  }, []);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true); };
  const openEdit = (row) => { setEditing(row); setForm({ name: row.name, category: row.category, quantity: row.quantity, unit: row.unit, status: row.status }); setModal(true); };
  const closeModal = () => { setModal(false); setEditing(null); };

  const handleSave = (e) => {
    e.preventDefault();
    const entry = { ...form, quantity: Number(form.quantity) };
    if (editing) {
      setItems((prev) => prev.map((r) => r.id === editing.id ? { ...editing, ...entry } : r));
    } else {
      const newItem = { ...entry, id: crypto.randomUUID() };
      setItems((prev) => [newItem, ...prev]);
      operationsService.createResource(entry).catch(() => null);
    }
    closeModal();
  };

  const handleDelete = (row) => {
    if (window.confirm(`Remove "${row.name}" from inventory?`)) {
      setItems((prev) => prev.filter((r) => r.id !== row.id));
    }
  };

  const filtered = items.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.category?.toLowerCase().includes(search.toLowerCase())
  );

  const totalAvailable = items.filter((r) => r.status === 'available').length;
  const totalDeployed  = items.filter((r) => r.status === 'deployed').length;
  const totalReserved  = items.filter((r) => r.status === 'reserved').length;

  const columns = [
    {
      key: 'name', label: 'Resource',
      render: (val, row) => {
        const Icon = CATEGORY_ICONS[row.category] || Package;
        return (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Icon className="h-4 w-4 text-indigo-600" />
            </div>
            <span className="font-bold text-slate-900 text-sm">{val}</span>
          </div>
        );
      }
    },
    {
      key: 'category', label: 'Category',
      render: (val) => <span className="capitalize text-sm text-slate-600">{val}</span>
    },
    {
      key: 'quantity', label: 'Quantity',
      render: (val, row) => (
        <span className="font-semibold text-slate-800">{val} <span className="text-slate-400 font-normal text-xs">{row.unit}</span></span>
      )
    },
    {
      key: 'status', label: 'Status',
      render: (val) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_COLORS[val] || 'bg-slate-100 text-slate-600'}`}>{val}</span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <PageHeader title="Resource Management" description="Manage food, water, medicines, rescue equipment, and distribution requests." />
        <button
          onClick={openAdd}
          className="shrink-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-3 rounded-2xl shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard icon={Package} label="Total Items"    value={String(items.length)} helper="In inventory"          />
        <StatCard icon={Package} label="Available"      value={String(totalAvailable)} helper="Ready for dispatch"  tone="indigo" />
        <StatCard icon={Truck}   label="Deployed"        value={String(totalDeployed)}  helper="In active use"       tone="amber" />
        <StatCard icon={Heart}   label="Reserved"        value={String(totalReserved)}  helper="Allocated to ops"    tone="slate" />
      </div>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="w-full sm:w-72 pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Search resources…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <AegisTable
        title="Resource Inventory"
        columns={columns}
        data={filtered}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-indigo-600 px-6 py-5 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{editing ? 'Update Resource' : 'Add Resource'}</h3>
                <p className="text-xs text-indigo-200 mt-0.5">Inventory management portal</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Resource Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Emergency water units"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="food">Food</option>
                    <option value="water">Water</option>
                    <option value="medical">Medical</option>
                    <option value="equipment">Equipment</option>
                    <option value="vehicle">Vehicle</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="deployed">Deployed</option>
                    <option value="depleted">Depleted</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Quantity *</label>
                  <input
                    required type="number" min="0"
                    value={form.quantity}
                    onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="680"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">Unit</label>
                  <input
                    value={form.unit}
                    onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="packs, litres, kits…"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {editing ? 'Save Changes' : 'Add to Inventory'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
