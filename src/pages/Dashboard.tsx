import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-medium text-lg mb-4">Total Cameras</h2>
          <p className="text-3xl font-bold">4</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-medium text-lg mb-4">Total Subjects</h2>
          <p className="text-3xl font-bold">3</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-medium text-lg mb-4">Recent Detections</h2>
          <p className="text-3xl font-bold">5</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;