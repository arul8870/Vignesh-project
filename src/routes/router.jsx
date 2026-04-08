import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import LoginForm from "../Pages/LoginPage";
import DashboardLayout from "../layouts/DashboardLayout";
import StudentDashboard from "../Pages/Placement/StudentDashboard";
import StudentJobs from "../Pages/Placement/Student/StudentJobs";
import StudentApplications from "../Pages/Placement/Student/StudentApplications";
import StudentSaved from "../Pages/Placement/Student/StudentSaved";
import StudentLocal from "../Pages/Placement/Student/StudentLocal";
import StudentNotifications from "../Pages/Placement/Student/StudentNotifications";
import StudentProfile from "../Pages/Placement/StudentProfile";

import AdminDashboard from "../Pages/Placement/AdminDashboard";
import AdminAnalytics from "../Pages/Placement/Admin/AdminAnalytics";
import AdminPlacements from "../Pages/Placement/Admin/AdminPlacements";
import AdminApplications from "../Pages/Placement/Admin/AdminApplications";
import AdminStudents from "../Pages/Placement/Admin/AdminStudents";
import AdminAnnouncements from "../Pages/Placement/Admin/AdminAnnouncements";
import AdminSettings from "../Pages/Placement/Admin/AdminSettings";
import AdminLocalJobs from "../Pages/Placement/Admin/AdminLocalJobs";

import LocalJobs from "../Pages/Placement/LocalJobs";
import UserActivities from "../Pages/UserActivities";
import PlacedStudents from "../Pages/Placement/PlacedStudents";

import { app_routes } from "../utils/constants";

export const router = createBrowserRouter([
  { path: app_routes.login, element: <LoginForm /> },

  {
    path: app_routes.root,
    element: <ProtectedRoute />, // Wrap all dashboard routes
    children: [
      {
        element: <DashboardLayout />, // Layout inside protected route
        children: [
          { index: true, element: <StudentDashboard /> },
          // Admin Feature Mappings - V3 Overhaul
          { path: app_routes.admin_dashboard, element: <AdminDashboard /> },
          { path: app_routes.admin_analytics, element: <AdminAnalytics /> },
          { path: app_routes.admin_placements, element: <AdminPlacements /> },
          { path: app_routes.admin_applications, element: <AdminApplications /> },
          { path: app_routes.admin_students, element: <AdminStudents /> },
          { path: app_routes.admin_announcements, element: <AdminAnnouncements /> },
          { path: app_routes.admin_settings, element: <AdminSettings /> },
          { path: app_routes.admin_local_jobs, element: <AdminLocalJobs /> },

          // Student Feature Mappings - V3 Overhaul
          { path: app_routes.student_dashboard, element: <StudentDashboard /> },
          { path: app_routes.student_jobs, element: <StudentJobs /> },
          { path: app_routes.student_applications, element: <StudentApplications /> },
          { path: app_routes.student_saved, element: <StudentSaved /> },
          { path: app_routes.student_local, element: <StudentLocal /> },
          { path: app_routes.student_notifications, element: <StudentNotifications /> },
          { path: app_routes.student_profile, element: <StudentProfile /> },

          // Shared / Compat
          { path: app_routes.placement_updates, element: <StudentDashboard /> },
          { path: app_routes.local_jobs, element: <StudentLocal /> },
          { path: app_routes.placed_students, element: <PlacedStudents /> },
          { path: app_routes.tracking, element: <StudentDashboard /> },
          { path: app_routes.user_activities, element: <UserActivities /> },
        ],
      },
    ],
  },
]);
