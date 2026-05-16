import { BadgeCheck, MapPinned, PackageCheck, Users } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import IncidentList from '../../components/dashboard/IncidentList';
import MissionTimeline from '../../components/dashboard/MissionTimeline';
import NotificationPanel from '../../components/dashboard/NotificationPanel';
import ResourceSnapshot from '../../components/dashboard/ResourceSnapshot';
import StatusBoard from '../../components/dashboard/StatusBoard';

const assignments = [
  { id: 'MIS-112', title: 'Medical support pickup', meta: 'Clinic depot · 3.2 km', priority: 'high' },
  { id: 'MIS-107', title: 'Shelter supply transfer', meta: 'North shelter', priority: 'normal' },
  { id: 'MIS-101', title: 'Evacuation assistance', meta: 'Ward 4 residential lane', priority: 'critical' }
];

const timeline = [
  { title: 'Availability confirmed', detail: 'Your helper profile is marked available.', time: 'Now', status: 'completed' },
  { title: 'Mission queue synced', detail: 'Nearby assignments are ready for acceptance.', time: '2 min ago', status: 'active' },
  { title: 'Route lock', detail: 'Route updates begin after accepting a mission.', time: 'Pending', status: 'pending' }
];

const fieldStatus = [
  { label: 'Current zone', detail: 'North response corridor' },
  { label: 'Team size', detail: '4 volunteers available' },
  { label: 'Vehicle status', detail: 'One van and two bikes ready' },
  { label: 'Safety note', detail: 'Avoid South bypass due to waterlogging.' }
];

export default function HelperDashboard() {
  return (
    <>
      <PageHeader title="Helper and NGO Dashboard" description="Accept missions, share resources, update availability, and coordinate field operations." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={BadgeCheck} label="Assigned Missions" value="3" helper="1 critical priority" tone="danger" />
        <StatCard icon={Users} label="Available Volunteers" value="4" helper="Ready for dispatch" />
        <StatCard icon={PackageCheck} label="Resource Requests" value="7" helper="Food, water, medical" tone="amber" />
        <StatCard icon={MapPinned} label="Route Updates" value="Live" helper="Simulation mode" tone="slate" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <StatusBoard title="Field Readiness" items={fieldStatus} />
          <IncidentList incidents={assignments} title="Mission Queue" />
          <MissionTimeline items={timeline} />
        </div>
        <div className="space-y-6">
          <NotificationPanel compact />
          <ResourceSnapshot />
        </div>
      </div>
    </>
  );
}
