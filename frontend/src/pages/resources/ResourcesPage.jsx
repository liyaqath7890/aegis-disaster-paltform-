import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { resources as demoResources } from '../../constants/demoData';
import { operationsService } from '../../services/operationsService';

export default function ResourcesPage() {
  const [items, setItems] = useState(demoResources);

  useEffect(() => {
    operationsService.listResources().then((response) => setItems(response.data.data)).catch(() => setItems(demoResources));
  }, []);

  return (
    <>
      <PageHeader title="Resource Management" description="Manage food, water, medicines, rescue equipment, vehicles, and distribution requests." />
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3">Resource</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((resource) => (
              <tr key={resource.id}>
                <td className="px-4 py-3 font-semibold text-slate-900">{resource.name}</td>
                <td className="px-4 py-3 capitalize text-slate-600">{resource.category}</td>
                <td className="px-4 py-3 text-slate-600">{resource.quantity} {resource.unit}</td>
                <td className="px-4 py-3"><span className="rounded-full bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-700">{resource.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
