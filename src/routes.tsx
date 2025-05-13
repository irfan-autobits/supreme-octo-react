// src/routes.ts (or src/routes.tsx)
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

// Import your components (make sure these are .tsx files with proper types)
import Logout from './components/user_auth/logout';
import Login from './components/user_auth/login';
import Signup from './components/user_auth/sign_up';
import CameraManager from './components/camera_management/CameraManager';
import AnalysisTable from './components/analy_tab/AnalysisTable';
import StatsPage from './components/stats/StatsPage';
import Tracker from './components/journey/Tracker';
import SubjectMan from './components/admin/SubjectMan';
import SettingsPage from './components/settings/Settings';

// Define a type for your route objects
interface AppRouteObject extends RouteObject {
  path: string;
  element: React.ReactNode;
  // Add any other properties your route objects have (e.g., exact)
}

const publicRoutes: AppRouteObject[] = [
  { path: "/logout", element: <Logout /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Signup /> },
  // Note: The catch-all "*" route is handled in App.tsx
];

const privateRoutes: AppRouteObject[] = [
  { path: "", element: <Navigate to="/cameras" /> },
  { path: "cameras", element: <CameraManager /> },
  { path: "analysis", element: <AnalysisTable /> },
  { path: "stats", element: <StatsPage /> },
  { path: "tracker", element: <Tracker /> },
  { path: "subjectman", element: <SubjectMan /> },
  { path: "settings", element: <SettingsPage /> },
];

export { publicRoutes, privateRoutes };
