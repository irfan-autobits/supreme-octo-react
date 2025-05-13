import React, { useState } from 'react';
import { mockDetections } from '../utils/mockData';
import { Search } from 'lucide-react';
import Input from '../components/UI/Input';
import Table from '../components/UI/Table';

const DetectionTable: React.FC = () => {
  const [detections, setDetections] = useState(mockDetections);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDetections = detections.filter(
    (detection) =>
      detection.personName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detection.cameraName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaders = [
    'ID',
    'Person Name',
    'Camera Name',
    'Camera Tag',
    'Detection Score',
    'Distance From Know',
    'Timestamp',
    'Image',
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Detection Table</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="max-w-md">
            <Input
              icon={<Search size={16} className="text-gray-400" />}
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table headers={tableHeaders}>
          {filteredDetections.map((detection, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {detection.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {detection.personName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {detection.cameraName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {detection.cameraTag}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {detection.detectionScore}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {detection.distanceFromKnow}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {detection.timestamp}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <img
                  className="h-10 w-10 rounded-full object-cover"
                  src={detection.image}
                  alt=""
                />
              </td>
            </tr>
          ))}
        </Table>
      </div>
    </div>
  );
};

export default DetectionTable;