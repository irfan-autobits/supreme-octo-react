// project/src/pages/CameraManager.tsx
import React, { useState, useEffect } from "react";
import Button from "../components/UI/Button";
// import Modal from '../components/UI/Modal';
import { Plus, RotateCcw } from "lucide-react";
import CameraCard from "../features/Cameras/CameraCard";
import AddCameraModal from "../features/Cameras/AddCameraModal";
import LiveFeed from "../features/Cameras/LiveFeed";
import SettingToggle from "../features/Cameras/SettingToggle";

// import LiveFeed from '../components/CameraManagement/LiveFeed';
import { useQuery } from "@tanstack/react-query";
import socket from "../utils/socket";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

type Camera = {
  camera_name: string;
  status: boolean;
};

type FeedMap = Record<string, { imageUrl: string }>;

const CameraManager: React.FC = () => {
  const [cameraList, setCameraList] = useState<Camera[]>([]);
  const [camEnabled, setCamEnabled] = useState<Record<string, boolean>>({});
  const [isModalOpen, setModalOpen] = useState(false);
  const [cameraFeeds, setCameraFeeds] = useState<FeedMap>({});

  // active feed via react-query real-time polling -patch
  const { data: activeFeed } = useQuery({
    queryKey: ["activeFeed"],
    queryFn: async () => {
      const r = await fetch(`${API_URL}/api/active_feed`);
      const j = await r.json();
      return j.active_camera;
    },
    refetchInterval: 500,
  });

  useEffect(() => {
    fetchCameras();
  }, []);

  // listen for frames
  useEffect(() => {
    const handler = ({ camera_name, image }: any) => {
      const blob = new Blob([image], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      setCameraFeeds((prev) => {
        const oldUrl = prev[camera_name]?.imageUrl;
        oldUrl && URL.revokeObjectURL(oldUrl);
        return { ...prev, [camera_name]: { imageUrl: url } };
      });
    };
    socket.on("frame-bin", handler);
    return () => {
      socket.off("frame-bin", handler);
    };
  }, []);

  // fetch camera list
  const fetchCameras = async () => {
    try {
      const res = await fetch(`${API_URL}/api/camera_list`);
      const { cameras } = await res.json();
      setCameraList(cameras);
      const statusMap: Record<string, boolean> = {};
      cameras.forEach((c: any) => {
        statusMap[c.camera_name] = c.status;
      });
      setCamEnabled(statusMap);
    } catch (err) {
      console.error(err);
    }
  };

  // helper POST
  const post = (path: string, body: any) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  // controls
  const handleAddCamera = (data: {
    camera_name: string;
    tag: string;
    camera_url: string;
  }) => {
    post("/api/add_camera", data).then(fetchCameras);
  };

  const handleRemoveCamera = (name: string) =>
    post("/api/remove_camera", { camera_name: name }).then(fetchCameras);
  // const handleRemoveCamera = (name: string) => {
  // console.log('🗑 Removing camera:', name);
  // post('/api/remove_camera', { camera_name: name })
  //   .then(res => res.json())
  //   .then(json => {
  //     console.log('↪️ Remove response:', json);
  //     fetchCameras();
  //   })
  //   .catch(err => console.error('⚠️ Remove error:', err));
  // };

  const handleStartCamera = (name: string) =>
    post("/api/start_proc", { camera_name: name }).then(() =>
      setCamEnabled((p) => ({ ...p, [name]: true }))
    );
  const handleStopCamera = (name: string) =>
    post("/api/stop_proc", { camera_name: name }).then(() =>
      setCamEnabled((p) => ({ ...p, [name]: false }))
    );

  const handleStartAll = () => {
    console.log("▶️ Starting all cameras");
    fetch(`${API_URL}/api/start_all_proc`)
      .then(fetchCameras)
      .catch((err) => console.error("⚠️ Start all error:", err));
  };

  const handleStopAll = () => {
    console.log("▶ Stopping all cameras");
    fetch(`${API_URL}/api/stop_all_proc`)
      .then(fetchCameras)
      .catch((err) => console.error("⚠️ Start all error:", err));
  };

  const handleRestartAll = () => {
    console.log("▶️ Restarting all cameras");
    fetch(`${API_URL}/api/restart_all_proc`)
      .then(fetchCameras)
      .catch((err) => console.error("⚠️ Start all error:", err));
  };
  const handleOpenFeed = (name: string) =>
    post("/api/start_feed", { camera_name: name }).then(fetchCameras);
  const handleCloseFeed = (name: string) =>
    post("/api/stop_feed", { camera_name: name }).then(fetchCameras);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Camera Manager</h1>
        <div className={`flex ${activeFeed ? "space-x-4" : ""}`}>
          <SettingToggle settingKey="RECOGNIZE" label="Enable Detection" />
          <Button
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => setModalOpen(true)}
          >
            Add
          </Button>
          <Button
            variant="outline"
            icon={<RotateCcw size={16} />}
            onClick={handleRestartAll}
          >
            Restart All
          </Button>
          <Button variant="outline" onClick={handleStartAll}>
            Start All
          </Button>
          <Button variant="outline" onClick={handleStopAll}>
            Stop All
          </Button>
        </div>
      </div>

      {/* Camera list */}
      {/* Wrap this whole section in a flex container when feed is open */}
      <div className={activeFeed ? "flex space-x-4" : ""}>
        {/* Left panel: cards */}
        <div
          className={
            activeFeed
              ? "flex flex-col space-y-4 w-1/2 overflow-auto"
              : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
          }
        >
          {cameraList.map((cam) => (
            <CameraCard
              key={cam.camera_name}
              camera={{
                id: cam.camera_name.length,
                name: cam.camera_name,
                tag: "",
                status: camEnabled[cam.camera_name] ? "active" : "inactive",
              }}
              onToggle={(_, action) =>
                action === "start"
                  ? handleStartCamera(cam.camera_name)
                  : handleStopCamera(cam.camera_name)
              }
              onRemove={handleRemoveCamera}
              onOpenFeed={handleOpenFeed}
              onCloseFeed={handleCloseFeed}
              activeFeed={activeFeed}
            />
          ))}
        </div>

        {/* Right panel: live feed */}
        {activeFeed && (
          <div className="w-1/2 p-4 bg-white rounded shadow overflow-auto">
            <LiveFeed
              activeCameraName={activeFeed}
              cameraFeeds={cameraFeeds}
              onClose={handleCloseFeed}
            />
          </div>
        )}
      </div>

      <AddCameraModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddCamera}
      />
    </div>
  );
};

export default CameraManager;
