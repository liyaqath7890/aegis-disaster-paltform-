import React, { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import AegisTable from '../../components/common/AegisTable';
import { Warehouse, Plus, Users, Heart, Package, X } from 'lucide-react';
import { shelters as demoShelters } from '../../constants/demoData';

const ShelterPage = () => {
  const [items, setItems] = useState(demoShelters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', capacity: '', occupancy: '', foodStockDays: '', medicalStockLevel: 'adequate' });

  const columns = [
    { key: 'name', label: 'Shelter Name', render: (val) => <span className="font-bold text-slate-900">{val}</span> },
    { key: 'location', label: 'Location', render: (loc) => loc?.address || 'Sector 4' },
    { 
      key: 'occupancy', 
      label: 'Occupancy', 
      render: (val, row) => {
        const percent = Math.round((val / row.capacity) * 100);
        return (
          <div className="w-32">
            <div className="flex justify-between text-[10px] mb-1 font-bold text-slate-500">
              <span>{val}/{row.capacity}</span>
              <span>{percent}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${percent > 90 ? 'bg-red-500' : percent > 70 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                style={{ width: `${percent}%` }} 
              />
            </div>
          </div>
        );
      }
    },
    { 
      key: 'foodStockDays', 
      label: 'Food Supply', 
      render: (val) => (
        <span className={`font-bold ${val < 3 ? 'text-red-600' : 'text-slate-700'}`}>{val} Days Left</span>
      )
    },
    { 
      key: 'medicalStockLevel', 
      label: 'Medical', 
      render: (val) => (
        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
          val === 'critical' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
        }`}>{val}</span>
      )
    }
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...formData } : i));
    } else {
      setItems([...items, { ...formData, id: Date.now(), location: { address: 'Manual Entry' } }]);
    }
    closeModal();
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({ name: '', capacity: '', occupancy: '', foodStockDays: '', medicalStockLevel: 'adequate' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to decommission ${row.name}?`)) {
      setItems(items.filter(i => i.id !== row.id));
    }
  };

  const totalCapacity = items.reduce((acc, curr) => acc + (Number(curr.capacity) || 0), 0);
  const totalOccupancy = items.reduce((acc, curr) => acc + (Number(curr.occupancy) || 0), 0);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <PageHeader title="Shelter Logistics" description="Command center for evacuation centers, resource tracking, and intake management." />
        <button 
          onClick={() => openModal()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl shadow-xl shadow-indigo-200 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Add New Shelter
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Warehouse} label="Total Shelters" value={String(items.length)} helper="Operational centers" tone="indigo" />
        <StatCard icon={Users} label="Current Occupancy" value={String(totalOccupancy)} helper={`Out of ${totalCapacity} spots`} tone={totalOccupancy/totalCapacity > 0.8 ? 'danger' : 'indigo'} />
        <StatCard icon={Package} label="Avg Food Stock" value="8.4" helper="Days of supply left" tone="amber" />
        <StatCard icon={Heart} label="Medical Status" value="Stable" helper="Across all sectors" tone="slate" />
      </div>

      <AegisTable 
        title="Evacuation Inventory" 
        columns={columns} 
        data={items} 
        onEdit={(row) => openModal(row)}
        onDelete={handleDelete}
      />

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">{editingItem ? 'Update Shelter' : 'Register Shelter'}</h3>
                <p className="text-xs text-indigo-100 mt-1">Operational configuration portal</p>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Shelter Name</label>
                <input 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  placeholder="e.g. Sector 7 Community Hall"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Capacity</label>
                  <input 
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Current Occupancy</label>
                  <input 
                    type="number"
                    required
                    value={formData.occupancy}
                    onChange={(e) => setFormData({...formData, occupancy: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Food Stock (Days)</label>
                  <input 
                    type="number"
                    required
                    value={formData.foodStockDays}
                    onChange={(e) => setFormData({...formData, foodStockDays: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Medical Status</label>
                  <select 
                    value={formData.medicalStockLevel}
                    onChange={(e) => setFormData({...formData, medicalStockLevel: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  >
                    <option value="adequate">Adequate</option>
                    <option value="low">Low</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {editingItem ? 'Sync Updates' : 'Confirm Registration'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelterPage;
