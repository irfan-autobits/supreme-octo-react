import React from 'react';

const Analysis: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Analysis</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="font-medium text-lg mb-4">Detection Analytics</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500">Analytics charts will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default Analysis;