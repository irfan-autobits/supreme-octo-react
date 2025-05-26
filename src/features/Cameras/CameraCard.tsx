// project/src/features/Cameras/CameraCard.tsx
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
  onToggle: (name: string, action: 'start' | 'stop') => void;
  onRemove: (name: string) => void;
  onOpenFeed: (name: string) => void;
  onCloseFeed: (name: string) => void;
  activeFeed?: string;
}

const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  onToggle,
  onRemove,
  onOpenFeed,
  onCloseFeed,
  activeFeed,
}) => {
  const isActive = camera.status === 'active';
  const isFeedOpen = activeFeed === camera.name;

  return (
    <Card>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-800">{camera.name}</h3>
          <Button
            variant="secondary"
            size="sm"
            aria-label="Delete camera"
            onClick={() => onRemove(camera.name)}
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
            onClick={() => onToggle(camera.name, isActive ? 'stop' : 'start')}
          >
            {isActive ? 'Stop Cam' : 'Start Cam'}
          </Button>

          <Button
            variant={isFeedOpen ? 'secondary' : 'outline'}
            className="flex-1"
            onClick={() =>
              isFeedOpen
                ? onCloseFeed(camera.name)
                : onOpenFeed(camera.name)
            }
          >
            {isFeedOpen ? 'Close Feed' : 'Open Feed'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CameraCard;
