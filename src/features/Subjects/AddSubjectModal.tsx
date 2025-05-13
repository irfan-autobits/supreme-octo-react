import React, { useState } from 'react';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Select from '../../components/UI/Select';

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (subject: any) => void;
}

const AddSubjectModal: React.FC<AddSubjectModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [subjectData, setSubjectData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    email: '',
    phone: '',
    aadhar: '',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSubjectData({ ...subjectData, [name]: value });
  };

  const handleGenderChange = (value: string) => {
    setSubjectData({ ...subjectData, gender: value });
  };

  const handleSubmit = () => {
    onAdd({
      ...subjectData,
      age: parseInt(subjectData.age) || 0,
    });
    setSubjectData({
      name: '',
      age: '',
      gender: 'Male',
      email: '',
      phone: '',
      aadhar: '',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
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
      title="Add Subject"
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Subject Name"
            name="name"
            value={subjectData.name}
            onChange={handleChange}
            placeholder="Enter name"
          />
          
          <Input
            label="Age"
            name="age"
            type="number"
            value={subjectData.age}
            onChange={handleChange}
            placeholder="Enter age"
          />
          
          <Select
            label="Gender"
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]}
            value={subjectData.gender}
            onChange={handleGenderChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={subjectData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
          
          <Input
            label="Phone"
            name="phone"
            value={subjectData.phone}
            onChange={handleChange}
            placeholder="Enter phone"
          />
        </div>
        
        <Input
          label="AADHAR"
          name="aadhar"
          value={subjectData.aadhar}
          onChange={handleChange}
          placeholder="Enter Aadhar number"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image(S)
            </label>
            <Button variant="outline" className="w-full py-2">
              Browse File
            </Button>
            <p className="mt-1 text-xs text-gray-500">No file chosen</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload CSV (for Bulk Import)
            </label>
            <Button variant="outline" className="w-full py-2">
              Browse File
            </Button>
            <p className="mt-1 text-xs text-gray-500">No file chosen</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddSubjectModal;