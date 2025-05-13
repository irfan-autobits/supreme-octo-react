import React, { useState } from 'react';
import { mockSubjects } from '../utils/mockData';
import { Plus, Search, Trash2 } from 'lucide-react';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import Table from '../components/UI/Table';
import Modal from '../components/UI/Modal';
import AddSubjectModal from '../features/Subjects/AddSubjectModal';

const SubjectManager: React.FC = () => {
  const [subjects, setSubjects] = useState(mockSubjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
  };

  const handleRemoveSubject = (id: number) => {
    setSubjects(subjects.filter((subject) => subject.id !== id));
  };

  const tableHeaders = ['Image', 'Person Name', 'Age', 'Gender', 'Email', 'Phone', 'Aadhar', 'Date Added', 'Action'];

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
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <img
                      className="h-10 w-10 rounded-full object-cover"
                      src={subject.image}
                      alt=""
                    />
                  </div>
                  <button className="ml-2 text-gray-400 hover:text-gray-500">
                    <Plus size={14} />
                  </button>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {subject.name}
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
                {subject.dateAdded}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleRemoveSubject(subject.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
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
        onAdd={handleAddSubject}
      />
    </div>
  );
};

export default SubjectManager;