import { ROLES } from '../constants/roles';
import { ROUTES } from '../constants/routes';

export function getDefaultRouteForRole(role) {
  switch (role) {
    case ROLES.AUTHORITY:
    case ROLES.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;
    case ROLES.HELPER:
      return ROUTES.HELPER_DASHBOARD;
    case ROLES.VICTIM:
    default:
      return ROUTES.VICTIM_DASHBOARD;
  }
}
