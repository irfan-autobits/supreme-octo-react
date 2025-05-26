// project/src/pages/SubjectManager.tsx
import React, { useState, useEffect } from 'react';
// import { mockSubjects } from '../utils/mockData';
import { Plus, Search, Trash2 } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import AddSubjectModal from '../features/Subjects/AddSubjectModal';
import AddSingleImage from '../features/Subjects/AddImg';
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

type ImageObj = { id: string; url: string };
type Subject = {
  id: string;                 // uuid
  images: ImageObj[];
  subject_name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  aadhar: string;
  added_date: string;         // ISO string from backend
};

const SubjectManager: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const fetchSubjects = () => {
    fetch(`${API_URL}/api/subject_list`)
      .then(response => response.json())
      .then(data => {
        setSubjects(data.subjects || []);
        console.log("Fetched subjects:", JSON.stringify(data.subjects, null, 2));

        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching subjects:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSubjects();
  }, [refreshTrigger]);

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.subject_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastSubject = currentPage * itemsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - itemsPerPage;
  const currentSubjects = filteredSubjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddSubject = (subject: any) => {
    setSubjects([...subjects, { ...subject, id: subjects.length + 1, dateAdded: new Date().toLocaleString() }]);
    setIsModalOpen(false);
    setRefreshTrigger(prev => prev + 1);

  };

    const handleRemoveSubject = async (id: string) => {
    if (!window.confirm("Do you want to Delete this Subject?")) return;
    // if (!window.confirm("Are you sure?")) return;
    // if (!window.confirm("ARE YOU REALLY REALLY SURE?")) return;
    // if (!window.confirm("This Action cant't be undone do you still want to do this?")) return;
    try {
      // Call your backend delete endpoint
      const response = await fetch(`${API_URL}/api/remove_sub/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      console.log("Subject removed:", result);
      fetchSubjects(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error removing subject:", error);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!window.confirm("Delete this image?")) return;
    try {
      await fetch(`${API_URL}/api/remove_subject_img/${imageId}`, {
        method: 'DELETE',
      });
      fetchSubjects(); // Refresh after deletion
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });

  const tableHeaders = ['Image', 'Person Name', 'Age', 'Gender', 'Email', 'Phone', 'Aadhar', 'Date Added', 'Action'];

  if (loading) {
    return <div>Loading subjects...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Subject Manager</h1>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Subject
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="max-w-md">
            <Input
              icon={<Search size={16} className="text-gray-400" />}
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table headers={tableHeaders}>
          {currentSubjects.map((subject) => (
            <tr key={subject.id}>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-2">
                  {subject.images.map((img) => (
                    <div key={img.id} className="relative w-12 h-12">
                      <img
                        src={img.url}
                        alt={subject.subject_name}
                        className="w-full h-full object-cover rounded cursor-pointer"
                        onClick={() => setPreviewSrc(img.url)}
                      />
                      <button
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center"
                        title="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {previewSrc && (
                    <div
                      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                      onClick={() => setPreviewSrc(null)}
                    >
                      <img src={previewSrc} className="max-h-[90vh] max-w-[90vw] rounded" />
                    </div>
                  )}

                  {/* plus‑button to add */}
                  <AddSingleImage
                    subjectId={subject.id}
                    onUploadSuccess={fetchSubjects}
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {subject.subject_name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {subject.age}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {subject.gender}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {subject.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {subject.phone}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {subject.aadhar}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {fmt(subject.added_date)}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {/* className="text-red-500 hover:text-red-700" */}
              <Button
                variant="outline"
                onClick={() => handleRemoveSubject(subject.id)}
              >
                Delete
              </Button>

              </td>
            </tr>
          ))}
        </Table>

        {totalPages > 1 && (
          <div className="p-4 flex justify-center">
            <nav className="flex items-center">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 ${
                    currentPage === index + 1
                      ? 'bg-purple-100 text-purple-700 rounded-md'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                &gt;
              </button>
            </nav>
          </div>
        )}
      </div>


      <AddSubjectModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onAddSuccess={() => setRefreshTrigger(prev => prev + 1)}
/>
    </div>
  );
};

export default SubjectManager;