// project/src/features/Cameras/LiveFeed.tsx
import React, { useRef } from "react";
import { X } from "lucide-react";

interface LiveFeedProps {
  activeCameraName: string;
  cameraFeeds: Record<string, { imageUrl: string }>;
  onClose: (name: string) => void;
}

const LiveFeed: React.FC<LiveFeedProps> = ({
  activeCameraName,
  cameraFeeds,
  onClose,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);

  // if (!activeCameraName) return null;
  const feed = cameraFeeds[activeCameraName];
  // if (!feed?.imageUrl) return <div>Waiting for feed…</div>;

  const goFullscreen = () => {
    if (imgRef.current?.requestFullscreen) {
      imgRef.current.requestFullscreen();
    }
  };

return (
  <div className="flex flex-col w-full border rounded-lg shadow bg-white">
    {feed?.imageUrl && (
      <div className="flex justify-between items-center px-4 py-2 border-b">
        <h3 className="text-lg font-semibold">{activeCameraName}</h3>
        <button
          onClick={() => onClose(activeCameraName)}
          className="text-xl text-gray-500 hover:text-red-600"
        >
          <X size={20} />
        </button>
      </div>
    )}

    <div className="p-4 flex justify-center items-center min-h-[500px] bg-gray-100">
      {feed?.imageUrl ? (
        <img
          ref={imgRef}
          src={feed.imageUrl}
          alt={`Live feed: ${activeCameraName}`}
          className="max-w-full max-h-[500px] rounded-lg cursor-pointer shadow-2xl"
          onClick={goFullscreen}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 shadow-2xl">
          <span className="text-lg">Camera Preview</span>
        </div>
      )}
    </div>
  </div>
);

};

export default LiveFeed;
