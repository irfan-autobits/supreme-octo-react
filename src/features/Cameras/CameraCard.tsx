// project/src/features/Cameras/CameraCard.tsx
import React from "react";
import Button from "../../components/UI/Button";
import { Pen, Trash2 } from "lucide-react";
import { CCTVCam, ThrDots } from "../../assets/icons/svgs";
import PopupMenu from "../../components/UI/PopupMenu";
interface Camera {
  id: number;
  name: string;
  tag: string;
  status: string | boolean;
}

// Here, onEdit is a function that gets passed an object { camera_name, tag }:
interface CameraCardProps {
  camera: Camera;
  onToggle: (name: string, action: "start" | "stop") => void;
  onRemove: (name: string) => void;
  onOpenFeed: (name: string) => void;
  onCloseFeed: (name: string) => void;
  activeFeed?: string;
  onEdit: (cam: { camera_name: string; tag: string }) => void;
  cameraFeeds: Record<string, { imageUrl: string }>;
}

const CameraCard: React.FC<CameraCardProps> = ({
  camera,
  onToggle,
  onRemove,
  onOpenFeed,
  onCloseFeed,
  activeFeed,
  onEdit,
  cameraFeeds,
}) => {
  const isActive = camera.status;
  const isFeedOpen = activeFeed === camera.name;
  const feed = cameraFeeds[camera.name];
  const [showPopup, setShowPopup] = React.useState(false);
  const liveFeed = cameraFeeds[camera.name]?.imageUrl;

  return (
    <div
      className={`bg-white rounded-xl border ${
        isFeedOpen ? "border-[var(--ab-pr)]" : ""
      } hover:border-gray-400 shadow-sm p-4`}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2"></div>

        <div className="flex-1 rounded-md mb-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <div
                className={`h-[10px] w-[10px] rounded-full ${
                  isActive === true
                    ? "bg-green-500"
                    : isActive === false
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              ></div>
              <div className="text-sm font-semibold text-gray-700 truncate max-w-[180px]">
                {camera.name}
              </div>
            </div>
          </div>

          <div className="bg-gray-100 flex items-center justify-center flex-col">
            <div className="flex items-center justify-center flex-1 text-black-500 font-medium relative">
              {/* <CCTVCam height="100px" fill="#dbdbdb" /> */}

              <div className="w-full min-h-[150px] flex items-center justify-center bg-zinc-100 rounded-md">
                {liveFeed ? (
                  <img
                    src={liveFeed}
                    alt={`Live feed: ${camera.name}`}
                    className="h-full rounded-md object-contain"
                  />
                ) : (
                  <span className="text-zinc-400 text-xs">No Preview</span>
                  // <span className="text-zinc-400 text-xs animate-pulse">Waiting for live feed...</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant={
              isActive === true
                ? "lightRed"
                : isActive === false
                ? "lightGreen"
                : "disabled"
            }
            className="flex-1"
            onClick={() => {
              isActive === true
                ? onToggle(camera.name, "stop")
                : isActive === false
                ? onToggle(camera.name, "start")
                : null;
            }}
          >
            {isActive === true
              ? "Stop Cam"
              : isActive === false
              ? "Start Cam"
              : camera.status}
          </Button>

          <Button
            variant={isFeedOpen ? "darkGreenoutline" : "darkGreen"}
            className="flex-1"
            onClick={() =>
              isFeedOpen ? onCloseFeed(camera.name) : onOpenFeed(camera.name)
            }
          >
            {isFeedOpen ? "Close Feed" : "Open Feed"}
          </Button>

          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              aria-label="Options"
              onClick={() => setShowPopup((prev) => !prev)}
            >
              <ThrDots height="24px" fill="black" />
            </Button>

            <PopupMenu
              isOpen={showPopup}
              onClose={() => setShowPopup(false)}
              className="absolute z-10 bottom-full mb-2 right-0 bg-white shadow-lg rounded-lg"
              children={
                <>
                  <button
                    className="flex w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
                    onClick={() => {
                      setShowPopup(false);
                      onEdit({ camera_name: camera.name, tag: camera.tag });
                    }}
                  >
                    <Pen size={16} className="text-gray-500 mr-2" />
                    <span>Edit</span>
                  </button>
                  <button
                    className="flex w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100"
                    onClick={() => {
                      setShowPopup(false);
                      onRemove(camera.name);
                    }}
                  >
                    <Trash2 size={16} className="text-red-500 mr-2" />
                    <span>Delete</span>
                  </button>
                </>
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCard;
