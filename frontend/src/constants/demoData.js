export const shelters = [
  {
    id: 'shelter-central',
    name: 'Central High School Shelter',
    capacity: 220,
    occupancy: 143,
    status: 'open',
    medical: true,
    food: '680 packs',
    location: { lat: 19.0821, lng: 72.8812, address: 'Relief Zone A' }
  },
  {
    id: 'shelter-north',
    name: 'North Community Hall',
    capacity: 140,
    occupancy: 132,
    status: 'open',
    medical: false,
    food: '210 packs',
    location: { lat: 19.096, lng: 72.889, address: 'North corridor' }
  },
  {
    id: 'shelter-west',
    name: 'West Sports Complex',
    capacity: 360,
    occupancy: 301,
    status: 'open',
    medical: true,
    food: '980 packs',
    location: { lat: 19.071, lng: 72.856, address: 'West sector' }
  }
];

export const resources = [
  { id: 'food-1', name: 'Food packs', category: 'food', quantity: 680, unit: 'packs', status: 'available' },
  { id: 'water-1', name: 'Emergency water units', category: 'water', quantity: 1240, unit: 'litres', status: 'available' },
  { id: 'med-1', name: 'Medical kits', category: 'medical', quantity: 214, unit: 'kits', status: 'reserved' },
  { id: 'gear-1', name: 'Rescue ropes', category: 'equipment', quantity: 88, unit: 'sets', status: 'deployed' }
];

export const missingPersons = [
  {
    id: 'mp-1',
    fullName: 'Ravi Mehta',
    age: 42,
    gender: 'Male',
    status: 'missing',
    lastSeenLocation: { address: 'East Bank sector', lat: 19.0902, lng: 72.8678 },
    description: 'Last seen near relief bus pickup point.'
  },
  {
    id: 'mp-2',
    fullName: 'Nisha Rao',
    age: 17,
    gender: 'Female',
    status: 'sighted',
    lastSeenLocation: { address: 'Central High School shelter', lat: 19.0821, lng: 72.8812 },
    description: 'Possible sighting reported by volunteer desk.'
  }
];

export const dangerZones = [
  {
    id: 'danger-east-bank',
    label: 'East Bank Flood Corridor',
    center: [19.0902, 72.8678],
    radius: 900
  },
  {
    id: 'danger-south-bypass',
    label: 'South Bypass Blocked Route',
    center: [19.061, 72.875],
    radius: 650
  }
];

export const helperMarkers = [
  { id: 'team-alpha', name: 'Team Alpha', lat: 19.086, lng: 72.872, status: 'dispatching' },
  { id: 'team-bravo', name: 'Team Bravo', lat: 19.074, lng: 72.884, status: 'rescue active' }
];
