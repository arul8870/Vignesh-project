// roleStrategies.js
import { app_routes } from "../utils/constants";

export const ROUTES_FOR_STUDENT = [
  app_routes.root,
  app_routes.student_dashboard,
  app_routes.student_jobs,
  app_routes.student_applications,
  app_routes.student_saved,
  app_routes.student_local,
  app_routes.student_notifications,
  app_routes.student_profile,
  // Compat/Shared
  app_routes.placement_updates,
  app_routes.local_jobs,
  app_routes.placed_students,
  app_routes.tracking,
];
export const ROUTES_FOR_ADMIN = ["*"];

export const roleStrategies = {
  Student: () => ROUTES_FOR_STUDENT,
  Admin: () => ROUTES_FOR_ADMIN,
};

export const getRoutesForRoles = (roles = []) => {
  const routesSet = new Set();
  roles.forEach((role) => {
    if (roleStrategies[role]) {
      roleStrategies[role]().forEach((route) => routesSet.add(route));
    }
  });
  return Array.from(routesSet);
};