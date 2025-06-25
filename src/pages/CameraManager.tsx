// project/src/pages/CameraManager.tsx
import React, { useState, useEffect } from "react";
import Button from "../components/UI/Button";
import { Plus, RotateCcw } from "lucide-react";
import CameraCard from "../features/Cameras/CameraCard";
import AddCameraModal from "../features/Cameras/AddCameraModal";
import LiveFeed from "../features/Cameras/LiveFeed";
import SettingToggle from "../features/Cameras/SettingToggle";
import EditCameraModal from "../features/Cameras/EditCameraModal";
import DetectionTable from "../features/DetectionTab/DetTab";
import { useQuery } from "@tanstack/react-query";
import socket from "../utils/socket";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

type Camera = {
  camera_name: string;
  status: boolean;
  tag: string;
};

type FeedMap = Record<string, { imageUrl: string }>;

interface EditCamera {
  camera_name: string;
  tag: string;
}

const CameraManager: React.FC = () => {
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [cameraList, setCameraList] = useState<Camera[]>([]);
  const [camEnabled, setCamEnabled] = useState<
    Record<string, boolean | string>
  >({});
  const [activeModal, setActiveModal] = useState<"none" | "add" | "edit">(
    "none"
  );
  const [cameraFeeds, setCameraFeeds] = useState<FeedMap>({});
  // Note: editingCamera is either an object _or_ null
  const [editingCamera, setEditingCamera] = useState<EditCamera | null>(null);

  // fetch "active" feed name every 500ms
  const { data: activeFeed } = useQuery({
    queryKey: ["activeFeed"],
    queryFn: async () => {
      const r = await fetch(`${API_URL}/api/active_feed`);
      const j = await r.json();
      return j.active_camera;
    },
    refetchInterval: 500,
  });

  // load camera list once (and whenever it changes)
  useEffect(() => {
    fetchCameras();
  }, []);

  // listen for socket frames
  useEffect(() => {
    const handler = ({ camera_name, image }: any) => {
      const blob = new Blob([image], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);

      // Store blob as Base64 string in localStorage for persistent preview
      const reader = new FileReader();
      reader.onload = () => {
        const base64data = reader.result as string;
        localStorage.setItem(`frame:${camera_name}`, base64data);
      };
      reader.readAsDataURL(blob);

      setCameraFeeds((prev) => {
        const oldUrl = prev[camera_name]?.imageUrl;
        if (oldUrl) URL.revokeObjectURL(oldUrl);
        return { ...prev, [camera_name]: { imageUrl: url } };
      });
    };
    socket.on("frame-bin", handler);
    return () => {
      socket.off("frame-bin", handler);
    };
  }, []);

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
  // for persistent preview
  useEffect(() => {
    const map: FeedMap = {};
    cameraList.forEach((cam) => {
      const saved = localStorage.getItem(`frame:${cam.camera_name}`);
      if (saved) {
        map[cam.camera_name] = { imageUrl: saved };
      }
    });
    setCameraFeeds(map);
  }, [cameraList]);

  const post = (path: string, body: any) =>
    fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

  // ─── “Add Camera” POST ───────────────────────────────────
  const handleAddCamera = (data: {
    camera_name: string;
    tag: string;
    camera_url: string;
  }) => {
    post("/api/add_camera", data).then(fetchCameras);
  };

  // ─── “Remove Camera” POST ───────────────────────────────────
  const handleRemoveCamera = (name: string) => {
    if (!window.confirm("Do you want to Delete this Camera?")) return;
    post("/api/remove_camera", { camera_name: name }).then(fetchCameras);
  };

  // ─── “Edit Camera” POST ───────────────────────────────────
  // Note: We expect two args: (updatedCamera, originalName)
  const handleEditCamera = (
    updatedCamera: { camera_name: string; tag: string },
    originalName: string
  ) => {
    // adjust this payload to whatever your backend expects
    post("/api/edit_camera", {
      original_name: originalName,
      new_name: updatedCamera.camera_name,
      new_tag: updatedCamera.tag,
    }).then(fetchCameras);
  };

  // Called when clicking “Edit” in the card’s popup
  const onEditHandle = (cam: { camera_name: string; tag: string }) => {
    setEditingCamera(cam);
    setActiveModal("edit");
    console.log("📝 Editing camera:", cam);
  };

  // ─── “Start/Stop Camera” ───────────────────────────────────
  const handleStartCamera = (name: string) => {
    setCamEnabled((p) => ({ ...p, [name]: "Starting..." }));
    post("/api/start_proc", { camera_name: name }).then(() =>
      setCamEnabled((p) => ({ ...p, [name]: true }))
    );
  };
  const handleStopCamera = (name: string) => {
    setCamEnabled((p) => ({ ...p, [name]: "Stopping..." }));
    post("/api/stop_proc", { camera_name: name }).then(() =>
      setCamEnabled((p) => ({ ...p, [name]: false }))
    );
  };

  const handleStartAll = () => {
    fetch(`${API_URL}/api/start_all_proc`)
      .then(fetchCameras)
      .catch((err) => console.error(err));
  };
  const handleStopAll = () => {
    fetch(`${API_URL}/api/stop_all_proc`)
      .then(fetchCameras)
      .catch((err) => console.error(err));
  };
  const handleRestartAll = () => {
    fetch(`${API_URL}/api/restart_all_proc`)
      .then(fetchCameras)
      .catch((err) => console.error(err));
  };

  const handleOpenFeed = (name: string) =>
    post("/api/start_feed", { camera_name: name }).then(fetchCameras);
  const handleCloseFeed = (name: string) =>
    post("/api/stop_feed", { camera_name: name }).then(fetchCameras);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Camera Manager</h1>
        <div className="flex">
          <SettingToggle
            settingKey="RECOGNIZE"
            label="Enable Detection"
            setIsDetecting={setIsDetecting}
          />
          <Button
            className="ml-2 mr-2"
            variant="primary"
            icon={<Plus size={16} />}
            onClick={() => {
              setActiveModal("add");
              setEditingCamera(null); // not editing any camera
            }}
          >
            Add
          </Button>

          <div className="inline-flex border rounded-md overflow-hidden">
            <Button
              variant="secondary"
              icon={<RotateCcw size={16} />}
              onClick={handleRestartAll}
              className="rounded-none rounded-l-md"
            >
              Restart All
            </Button>
            <Button
              variant="secondary"
              onClick={handleStartAll}
              className="rounded-none border-l"
            >
              Start All
            </Button>
            <Button
              variant="secondary"
              onClick={handleStopAll}
              className="rounded-none border-l rounded-r-md"
            >
              Stop All
            </Button>
          </div>
        </div>
      </div>

      {/* ─── Camera list + Live‐feed side‐by‐side ───────────────── */}
      <div className="flex space-x-4">
        {/* Left panel: list of cards */}
        {cameraList.length > 0 ? (
          <div className="w-80 flex flex-col space-y-4 overflow-auto">
            {cameraList.map((cam) => (
              <CameraCard
                key={cam.camera_name}
                camera={{
                  id: cam.camera_name.length,
                  name: cam.camera_name,
                  tag: cam.tag, // if your backend has a tag field, pull it in `cameraList`
                  status: camEnabled[cam.camera_name],
                }}
                onToggle={(name, action) =>
                  action === "start"
                    ? handleStartCamera(name)
                    : handleStopCamera(name)
                }
                onRemove={handleRemoveCamera}
                onOpenFeed={handleOpenFeed}
                onCloseFeed={handleCloseFeed}
                activeFeed={activeFeed}
                onEdit={onEditHandle}
                cameraFeeds={cameraFeeds}
              />
            ))}
          </div>
        ) : (
          <div className="w-80 border rounded-lg flex justify-center items-center text-zinc-400">
            No Cameras
          </div>
        )}

        {/* Right panel: live‐view pane (shows JPEG frames) */}
        <div className="flex-1 p-4 bg-white rounded-lg shadow overflow-auto shadow-sm">
          <LiveFeed
            activeCameraName={activeFeed}
            cameraFeeds={cameraFeeds}
            onClose={handleCloseFeed}
          />
          <DetectionTable
            activeCameraName={activeFeed}
            isDetecting={isDetecting}
          />
        </div>
      </div>

      {/* ─── Add‐modal ───────────────────────────────────────────── */}
      <AddCameraModal
        isOpen={activeModal === "add"}
        onClose={() => setActiveModal("none")}
        onAdd={handleAddCamera}
      />

      {/* ─── Edit‐modal ──────────────────────────────────────────── */}
      <EditCameraModal
        isOpen={activeModal === "edit"}
        onClose={() => {
          setActiveModal("none");
          setEditingCamera(null);
        }}
        onEdit={handleEditCamera}
        camera={editingCamera}
      />
    </div>
  );
};

export default CameraManager;
