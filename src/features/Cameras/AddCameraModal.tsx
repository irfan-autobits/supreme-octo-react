// project/src/features/Cameras/AddCameraModal.tsx
import React, { useState, FormEvent } from 'react';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (camera: { camera_name: string; tag: string; camera_url: string }) => void;
}

const AddCameraModal: React.FC<AddCameraModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState<'direct' | 'construct'>('direct');
  const [cameraData, setCameraData] = useState({
    camera_name: '',
    tag: '',
    camera_url: '',
    username: '',
    password: '',
    ip: '',
    port: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCameraData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let finalUrl = '';
    if (activeTab === 'direct') {
      finalUrl = cameraData.camera_url;
    } else {
      finalUrl = `rtsp://${cameraData.username}:${cameraData.password}@${cameraData.ip}:${cameraData.port}`;
    }
    onAdd({
      camera_name: cameraData.camera_name,
      tag: cameraData.tag,
      camera_url: finalUrl,
    });

    setCameraData({
      camera_name: '',
      tag:         '',
      camera_url:  '',
      username:    '',
      password:    '',
      ip:          '',
      port:        '',
    });
    onClose();
  };

  const footer = (
    <>
      <Button variant="primary" size="md" className="ml-3 min-w-[100px]" onClick={handleSubmit}>Test & Save</Button>
      {/* <Button variant="secondary" size="md" className="bg-gray-300 ml-3 min-w-[100px]">Test</Button> */}
      <Button variant="secondary" size="md" className="ml-3 min-w-[100px]" onClick={onClose}>Cancel</Button>
    </>
  );

  return (
    <Modal title="Add Camera" isOpen={isOpen} onClose={onClose} footer={footer}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'direct'
                ? 'text-[#85AF49] border-b-2 border-[#85AF49]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('direct')}
          >
            Direct URL
          </button>
          <button
            type="button"
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'construct'
                ? 'text-[#85AF49] border-b-2 border-[#85AF49]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('construct')}
          >
            Construct URL
          </button>
        </div>

        <Input
          label="Camera Name"
          name="camera_name"               // must be 'camera_name'
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

        {activeTab === 'direct' ? (
        <Input
          label="URL"
          name="camera_url"                // must be 'camera_url'
          value={cameraData.camera_url}
          onChange={handleChange}
          placeholder="Enter camera URL"
          required
        />
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="User Name"
                name="username"
                value={cameraData.username}
                onChange={handleChange}
                placeholder="Enter username"
                required
              />
              <Input
                label="Password"
                type="password"
                name="password"
                value={cameraData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Camera IP"
                name="ip"
                value={cameraData.ip}
                onChange={handleChange}
                placeholder="Enter camera IP"
                required
              />
              <Input
                label="Port"
                name="port"
                value={cameraData.port}
                onChange={handleChange}
                placeholder="Enter port"
                required
              />
            </div>
          </>
        )}
      </form>
    </Modal>
  );
};

export default AddCameraModal;
