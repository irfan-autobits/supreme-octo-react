import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Analysis from './pages/Analysis';
import CameraManager from './pages/CameraManager';
import PersonTracker from './pages/PersonTracker';
import SubjectManager from './pages/SubjectManager';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/camera-manager" element={<CameraManager />} />
          <Route path="/person-tracker" element={<PersonTracker />} />
          <Route path="/subject-manager" element={<SubjectManager />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;