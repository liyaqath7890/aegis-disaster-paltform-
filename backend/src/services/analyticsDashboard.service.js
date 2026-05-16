import { Alert, MissingPerson, Resource, Shelter, SosIncident, User } from '../models/index.js';

export async function getDashboardAnalytics() {
  const [incidents, resolvedIncidents, users, shelters, resources, alerts, missing] = await Promise.all([
    SosIncident.count(),
    SosIncident.count({ where: { status: 'resolved' } }),
    User.count(),
    Shelter.count(),
    Resource.count(),
    Alert.count(),
    MissingPerson.count()
  ]);

  return {
    summary: {
      incidents,
      resolvedIncidents,
      activeMissions: Math.max(incidents - resolvedIncidents, 0),
      users,
      shelters,
      resources,
      alerts,
      missing
    },
    incidentTrend: [
      { name: 'Mon', incidents: 12, resolved: 8 },
      { name: 'Tue', incidents: 17, resolved: 12 },
      { name: 'Wed', incidents: 23, resolved: 15 },
      { name: 'Thu', incidents: 19, resolved: 16 },
      { name: 'Fri', incidents: 28, resolved: 20 },
      { name: 'Sat', incidents: 31, resolved: 24 },
      { name: 'Sun', incidents: 26, resolved: 22 }
    ],
    resourceMix: [
      { name: 'Food', value: 34 },
      { name: 'Water', value: 42 },
      { name: 'Medical', value: 18 },
      { name: 'Equipment', value: 14 }
    ]
  };
}
