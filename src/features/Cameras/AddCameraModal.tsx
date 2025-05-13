import React, { useState } from 'react';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';

interface AddCameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (camera: any) => void;
}

const AddCameraModal: React.FC<AddCameraModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState('direct');
  const [cameraData, setCameraData] = useState({
    name: '',
    tag: '',
    url: '',
    username: '',
    password: '',
    ip: '',
    port: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCameraData({ ...cameraData, [name]: value });
  };

  const handleSubmit = () => {
    onAdd({
      name: cameraData.name,
      tag: cameraData.tag,
      url: cameraData.url,
    });
    setCameraData({
      name: '',
      tag: '',
      url: '',
      username: '',
      password: '',
      ip: '',
      port: '',
    });
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" className="ml-3" onClick={handleSubmit}>
        Save
      </Button>
    </>
  );

  return (
    <Modal
      title="Add Camera"
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
    >
      <div className="mb-4">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'direct'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('direct')}
          >
            Direct URL
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === 'construct'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('construct')}
          >
            Construct URL
          </button>
        </div>

        <div className="space-y-4">
          <Input
            label="Camera Name"
            name="name"
            value={cameraData.name}
            onChange={handleChange}
            placeholder="Enter camera name"
          />
          
          <Input
            label="Camera Tag"
            name="tag"
            value={cameraData.tag}
            onChange={handleChange}
            placeholder="Enter camera tag"
          />

          {activeTab === 'direct' ? (
            <Input
              label="URL"
              name="url"
              value={cameraData.url}
              onChange={handleChange}
              placeholder="Enter camera URL"
            />
          ) : (
            <>
              {activeTab === 'construct' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="User Name"
                      name="username"
                      value={cameraData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                    />
                    <Input
                      label="Password"
                      type="password"
                      name="password"
                      value={cameraData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Camera IP"
                      name="ip"
                      value={cameraData.ip}
                      onChange={handleChange}
                      placeholder="Enter camera IP"
                    />
                    <Input
                      label="Port"
                      name="port"
                      value={cameraData.port}
                      onChange={handleChange}
                      placeholder="Enter port"
                    />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AddCameraModal;