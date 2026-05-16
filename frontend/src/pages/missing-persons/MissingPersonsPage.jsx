import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import { missingPersons as demoMissingPersons } from '../../constants/demoData';
import { operationsService } from '../../services/operationsService';

export default function MissingPersonsPage() {
  const [items, setItems] = useState(demoMissingPersons);

  useEffect(() => {
    operationsService.listMissingPersons().then((response) => setItems(response.data.data)).catch(() => setItems(demoMissingPersons));
  }, []);

  return (
    <>
      <PageHeader title="Missing Person Tracking" description="Register reports, track sightings, and coordinate family reunification." />
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((person) => (
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={person.id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-950">{person.fullName}</h3>
                <p className="text-sm text-slate-500">{person.age} · {person.gender}</p>
              </div>
              <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">{person.status}</span>
            </div>
            <p className="mt-4 text-sm text-slate-600">{person.description}</p>
            <p className="mt-3 rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">Last known: {person.lastSeenLocation?.address}</p>
          </article>
        ))}
      </div>
    </>
  );
}
