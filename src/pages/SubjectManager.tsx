// project/src/pages/SubjectManager.tsx
import React, { useState } from "react";
import { Plus } from "lucide-react";

import Button from "../components/UI/Button";
import SubjectFilters from "../features/Subjects/SubjectFilters";
import Pagination from "../components/UI/Pagination";
import ImagePreview from "../utils/ImagePreview";
import { useSubjectList } from "../hooks/useSubjectList";
import { getPagedData } from "../utils/pagination";
import AddSubjectModal from "../features/Subjects/AddSubjectModal";
import EditSubjectModal from "../features/Subjects/EditSubjectModal";
import SubjectCard from "../features/Subjects/SubjectCard"; // renamed from PersonCard → SubjectCard
import { Subject } from "../features/Subjects/types";

const API_URL = import.meta.env.VITE_API_URL!;
const ITEMS_PER_PAGE = 10;

export default function SubjectManager() {
  // 1. Filter & pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Add‐modal & list‐refresh state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 3. Edit‐modal state (null when closed; holds a Subject when editing)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // 4. Preview state (full‐screen image viewer)
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  
  // 5. Fetch & filter data
  const { subjects: filteredSubjects, allSubjects, loading } = useSubjectList(
    API_URL,
    searchTerm,
    selectedSubject,
    refreshTrigger
  );

  // 6. Paginate
  const { currentPageItems, totalPages } = getPagedData(
    filteredSubjects,
    currentPage,
    ITEMS_PER_PAGE
  );

  // 7. Handlers
  const handleRemoveSubject = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subject?"))
      return;
    await fetch(`${API_URL}/api/remove_sub/${id}`, { method: "DELETE" });
    setRefreshTrigger((prev) => prev + 1);
  };

  // Open edit modal for this subject
  const handleEditSubject = (subject: Subject) => {
    setEditingSubject(subject);
  };

  if (loading) return <div>Loading subjects…</div>;

  const noSubjects = currentPageItems.length === 0;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Subject Manager
        </h1>
        <Button
          variant="primary"
          icon={<Plus size={16} />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Subject
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <SubjectFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          personOptions={allSubjects.map((s) => ({
            label: s.subject_name,
            value: s.subject_name,
          }))}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          onClearFilters={() => {
            setSearchTerm("");
            setSelectedSubject("");
            setCurrentPage(1);
          }}
        />

        {noSubjects ? (
          <div className="flex justify-center items-center h-40 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-500">No subjects found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {filteredSubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                onRemove={handleRemoveSubject}
                onEdit={handleEditSubject}
                onImageClick={(src) => setPreviewSrc(src)}
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {previewSrc && (
        <ImagePreview
          src={previewSrc}
          onClose={() => setPreviewSrc(null)}
          className="z-60"
        />
      )}

      <AddSubjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSuccess={() => setRefreshTrigger((p) => p + 1)}
      />

      {/*
        Only render EditSubjectModal when editingSubject is non-null.
        Pass editingSubject directly (never undefined).
      */}
      {editingSubject && (
        <EditSubjectModal
          subject={editingSubject}
          isOpen={true}
          onClose={() => setEditingSubject(null)}
          onEditSuccess={() => setRefreshTrigger((p) => p + 1)}
        />
      )}
    </div>
  );
}
