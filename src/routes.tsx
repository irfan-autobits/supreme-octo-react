// src/routes.tsx
import React from 'react';
import { Navigate, RouteObject } from 'react-router-dom';

import Login from './auth/components/Login';
import Signup from './auth/components/Signup';
import Logout from './auth/components/Logout';

import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import CameraManager from './pages/CameraManager';
import PersonTracker from './pages/PersonTracker';
import SubjectManager from './pages/SubjectManager';

// Define a route object type
export type AppRouteObject = RouteObject & {
  path: string;
  element: React.ReactNode;
};

export const publicRoutes: AppRouteObject[] = [
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Signup /> },
  { path: '/logout', element: <Logout /> },
];

export const privateRoutes: AppRouteObject[] = [
  { path: '/', element: <Navigate to="/camera-manager" replace /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/analysis', element: <Analysis /> },
  { path: '/camera-manager', element: <CameraManager /> },
  { path: '/person-tracker', element: <PersonTracker /> },
  { path: '/subject-manager', element: <SubjectManager /> },
];
