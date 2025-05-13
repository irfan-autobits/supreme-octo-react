import React from 'react';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import { Trash2 } from 'lucide-react';

interface Camera {
  id: number;
  name: string;
  tag: string;
  status: string;
}

interface CameraCardProps {
  camera: Camera;
  onToggle: (id: number, action: 'start' | 'stop') => void;
}

const CameraCard: React.FC<CameraCardProps> = ({ camera, onToggle }) => {
  const isActive = camera.status === 'active';

  return (
    <Card>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-800">{camera.name}</h3>
          <Button 
            variant="secondary" 
            size="sm"
            aria-label="Delete camera"
          >
            <Trash2 size={16} className="text-gray-500" />
          </Button>
        </div>
        
        <div className="flex-1 bg-gray-100 rounded-md mb-4 flex items-center justify-center">
          <div className="w-full h-32 flex items-center justify-center">
            {isActive ? (
              <div className="text-green-500 font-medium">Camera Active</div>
            ) : (
              <div className="text-gray-400">Camera Inactive</div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant={isActive ? 'secondary' : 'primary'}
            className="flex-1"
            onClick={() => onToggle(camera.id, isActive ? 'stop' : 'start')}
          >
            {isActive ? 'Stop Cam' : 'Start Cam'}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
          >
            Open Cam
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CameraCard;