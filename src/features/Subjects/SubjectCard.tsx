// project/src/features/Subjects/SubjectCard.tsx
import React from "react";
import { MoreHorizontal, Pen, Trash2 } from "lucide-react";
import PopupMenu from "../../components/UI/PopupMenu";
import { Subject } from "./types";
const API_URL = import.meta.env.VITE_API_URL!;

interface SubjectCardProps {
  subject: Subject;
  onRemove: (id: string) => void;
  onEdit: (subject: Subject) => void;
  onImageClick: (src: string) => void;
}

const SubjectCard: React.FC<SubjectCardProps> = ({
  subject,
  onRemove,
  onEdit,
  onImageClick,
}) => {
  const [showPopup, setShowPopup] = React.useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex flex-col gap-4 relative transition-all duration-200 hover:shadow-lg">
      {/* ⋯ button */}
      <div className="absolute top-3 right-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPopup((prev) => !prev);
          }}
          className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Options"
        >
          <MoreHorizontal size={20} className="text-gray-500" />
        </button>

        <PopupMenu
          isOpen={showPopup}
          onClose={() => setShowPopup(false)}
          className="absolute z-10 bottom-full mb-2 right-0 bg-white shadow-lg rounded-lg"
        >
          <button
            className="flex w-full px-4 py-2 text-sm text-left hover:bg-gray-100"
            onClick={() => {
              setShowPopup(false);
              onEdit(subject);
            }}
          >
            <Pen size={16} className="text-gray-500 mr-2" />
            <span>Edit</span>
          </button>
          <button
            className="flex w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-100"
            onClick={() => {
              setShowPopup(false);
              onRemove(subject.id);
            }}
          >
            <Trash2 size={16} className="text-red-500 mr-2" />
            <span>Delete</span>
          </button>
        </PopupMenu>
      </div>

      {/* subject info */}
      <h3 className="font-semibold text-lg text-gray-800">
        {subject.subject_name}
      </h3>

      <div className="text-sm text-gray-600">
        <p>{subject.email}</p>
        <p>{subject.phone}</p>
        <p>
          {subject.age} | {subject.gender}
        </p>
      </div>

      {/* Thumbnails: clicking opens full preview, “×” deletes that image */}
      <div className="flex flex-wrap gap-2 mt-2">
        {subject.images.map((image) => (
          <div key={image.id} className="relative w-12 h-12 rounded-full border-2 border-white overflow-hidden">
            <img
              src={`${API_URL}${image.url}`}
              alt={`${subject.subject_name} profile`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => onImageClick(`${API_URL}${image.url}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectCard;
