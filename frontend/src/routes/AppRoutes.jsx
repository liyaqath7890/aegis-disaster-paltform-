import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VictimDashboard from '../pages/victim/VictimDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import HelperDashboard from '../pages/helper/HelperDashboard';
import SosPage from '../pages/emergency/SosPage';
import DisasterMapPage from '../pages/maps/DisasterMapPage';
import ChatPage from '../pages/chat/ChatPage';
import ShelterPage from '../pages/shelters/ShelterPage';
import MissingPersonsPage from '../pages/missing-persons/MissingPersonsPage';
import ResourcesPage from '../pages/resources/ResourcesPage';
import AnalyticsPage from '../pages/analytics/AnalyticsPage';
import AlertsPage from '../pages/alerts/AlertsPage';
import AiSimulationPage from '../pages/ai/AiSimulationPage';
import DroneSimulationPage from '../pages/drone/DroneSimulationPage';
import UploadCenterPage from '../pages/uploads/UploadCenterPage';
import { ROLES } from '../constants/roles';

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <RegisterPage /> }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.VICTIM]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/victim', element: <VictimDashboard /> },
              { path: '/emergency/sos', element: <SosPage /> }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.HELPER]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/helper', element: <HelperDashboard /> }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.AUTHORITY]} />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/admin', element: <AdminDashboard /> },
              { path: '/analytics', element: <AnalyticsPage /> }
            ]
          }
        ]
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: '/maps', element: <DisasterMapPage /> },
              { path: '/chat', element: <ChatPage /> },
              { path: '/shelters', element: <ShelterPage /> },
              { path: '/missing-persons', element: <MissingPersonsPage /> },
              { path: '/resources', element: <ResourcesPage /> },
              { path: '/alerts', element: <AlertsPage /> },
              { path: '/ai', element: <AiSimulationPage /> },
              { path: '/drone', element: <DroneSimulationPage /> },
              { path: '/uploads', element: <UploadCenterPage /> }
            ]
          }
        ]
      }
    ]
  }
]);
