// project/src/features/Subjects/AddImg.tsx
import React, { useRef, ChangeEvent } from 'react';
import { Plus } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

interface Props {
  subjectId: string;                 // <-- backend uses uuid string
  onUploadSuccess: () => void;
}

const AddSingleImage: React.FC<Props> = ({ subjectId, onUploadSuccess }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${API_URL}/api/add_subject_img/${subjectId}`, {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      console.log('Image added:', result);
      onUploadSuccess?.(); // Refresh the list
    } catch (err) {
      console.error("Image upload error:", err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        className="ml-2 text-gray-400 hover:text-gray-500"
        title="Add image"
      >
        <Plus size={14} />
      </button>

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
      />
    </>
  );
};

export default AddSingleImage;
