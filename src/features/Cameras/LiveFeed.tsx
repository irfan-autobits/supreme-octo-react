// project/src/features/Cameras/LiveFeed.tsx
import React, { useRef } from 'react';

interface LiveFeedProps {
  activeCameraName: string;
  cameraFeeds: Record<string, { imageUrl: string }>;
  onClose: (name: string) => void;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ activeCameraName, cameraFeeds, onClose }) => {
  const imgRef = useRef<HTMLImageElement>(null);

  if (!activeCameraName) return null;
  const feed = cameraFeeds[activeCameraName];
  if (!feed?.imageUrl) return <div>Waiting for feed…</div>;

  const goFullscreen = () => {
    if (imgRef.current?.requestFullscreen) {
      imgRef.current.requestFullscreen();
    }
  };

  return (
    <div className="live-feed-container">
      <div className="camera-feed-card">
        <div className="card-header">
          <h3>{activeCameraName}</h3>
          <button onClick={() => onClose(activeCameraName)}>×</button>
        </div>
        <div className="card-body">
          <img
            ref={imgRef}
            src={feed.imageUrl}
            alt={`Live feed: ${activeCameraName}`}
            className="feed-img"
            onClick={goFullscreen}
            style={{ cursor: 'pointer' }}
          />
        </div>
      </div>
    </div>
  );
};

export default LiveFeed;
