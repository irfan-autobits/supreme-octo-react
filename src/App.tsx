// src/App.tsx
import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import { publicRoutes, privateRoutes } from './routes';
// import RequireAuth from './auth/RequireAuth';

const App: React.FC = () => (
  <Routes>
    {/* Public routes - no sidebar */}
    {publicRoutes.map((route) => (
      <Route key={route.path} path={route.path} element={route.element} />
    ))}

    {/* Private routes - protected + layout sidebar */}
    <Route > 
      {/* Layout wrapper for private routes */}
      <Route element={<Layout><Outlet /></Layout>}>
        {privateRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>
    </Route>

    {/* Catch-all fallback */}
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Routes>
);

export default App;