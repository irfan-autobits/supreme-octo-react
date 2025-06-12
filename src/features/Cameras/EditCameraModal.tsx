// project/src/features/Cameras/EditCameraModal.tsx
import React, { useState, FormEvent, useEffect } from "react";
import Modal from "../../components/UI/Modal";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";

interface EditCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onEdit now accepts (updatedCamera, originalName)
  onEdit: (
    updatedCamera: { camera_name: string; tag: string },
    originalName: string
  ) => void;
  camera: { camera_name: string; tag: string } | null;
}

const EditCameraModal: React.FC<EditCameraModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  camera,
}) => {
  const [cameraData, setCameraData] = useState({
    camera_name: "",
    tag: "",
  });

  // When the `camera` prop changes, preload the form
  useEffect(() => {
    if (camera) {
      setCameraData({
        camera_name: camera.camera_name,
        tag: camera.tag,
      });
    }
  }, [camera]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCameraData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!camera) return;

    // Call onEdit with both (updatedCamera, originalName)
    onEdit(
      { camera_name: cameraData.camera_name, tag: cameraData.tag },
      camera.camera_name
    );

    // Reset local form state
    setCameraData({
      camera_name: "",
      tag: "",
    });
    onClose();
  };

  const footer = (
    <>
      <Button variant="primary" className="ml-3 min-w-[100px]" onClick={handleSubmit} type="submit">
        Save
      </Button>
      <Button variant="secondary" className="min-w-[100px]" onClick={onClose}>
        Cancel
      </Button>
    </>
  );

  return (
    <Modal title="Edit Camera" isOpen={isOpen} onClose={onClose} footer={footer}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Camera Name"
          name="camera_name"
          value={cameraData.camera_name}
          onChange={handleChange}
          placeholder="Enter camera name"
          required
        />
        <Input
          label="Camera Tag"
          name="tag"
          value={cameraData.tag}
          onChange={handleChange}
          placeholder="Enter camera tag"
          required
        />
      </form>
    </Modal>
  );
};

export default EditCameraModal;
