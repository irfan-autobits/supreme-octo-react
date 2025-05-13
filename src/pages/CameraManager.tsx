import React, { useState } from 'react';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Input from '../components/UI/Input';
import { Plus, RotateCcw, Play, Pause } from 'lucide-react';
import { mockCameras } from '../utils/mockData';
import CameraCard from '../features/Cameras/CameraCard';
import AddCameraModal from '../features/Cameras/AddCameraModal';

const CameraManager: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('direct');
  const [cameras, setCameras] = useState(mockCameras);
  const [isRunning, setIsRunning] = useState(false);

  const toggleCamera = (id: number, action: 'start' | 'stop') => {
    setCameras(
      cameras.map((camera) =>
        camera.id === id
          ? { ...camera, status: action === 'start' ? 'active' : 'inactive' }
          : camera
      )
    );
  };

  const handleStartAll = () => {
    setCameras(cameras.map((camera) => ({ ...camera, status: 'active' })));
    setIsRunning(true);
  };

  const handleStopAll = () => {
    setCameras(cameras.map((camera) => ({ ...camera, status: 'inactive' })));
    setIsRunning(false);
  };

  const handleReset = () => {
    setCameras(mockCameras);
    setIsRunning(false);
  };

  const handleAddCamera = (camera: any) => {
    setCameras([...cameras, { ...camera, id: cameras.length + 1, status: 'inactive' }]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Camera Manager</h1>
        <div className="flex space-x-2">
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsModalOpen(true)}
          >
            Add
          </Button>
          <Button
            variant="outline"
            icon={<RotateCcw size={16} />}
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button 
            variant={isRunning ? 'secondary' : 'primary'}
            onClick={isRunning ? handleStopAll : handleStartAll}
          >
            {isRunning ? 'Stop' : 'Start'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cameras.map((camera) => (
          <CameraCard 
            key={camera.id}
            camera={camera}
            onToggle={toggleCamera}
          />
        ))}
      </div>

      <AddCameraModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddCamera}
      />
    </div>
  );
};

export default CameraManager;