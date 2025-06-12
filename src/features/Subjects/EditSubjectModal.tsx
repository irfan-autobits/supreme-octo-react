// project/src/features/Subjects/EditSubjectModal.tsx
import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
} from "react";
import Modal from "../../components/UI/Modal";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import { Subject } from "./types";
import { Plus } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL!;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

interface Props {
  subject: Subject;
  isOpen: boolean;
  onClose: () => void;
  onEditSuccess: () => void; // tells parent to re-fetch after Save
}

const EditSubjectModal: React.FC<Props> = ({
  subject,
  isOpen,
  onClose,
  onEditSuccess,
}) => {
  // 1) Metadata form state
  const [form, setForm] = useState({
    subject_name: subject.subject_name,
    Age: subject.age.toString(),
    Gender: subject.gender,
    Email: subject.email,
    Phone: subject.phone,
    Aadhar: subject.aadhar,
  });

  // 2) Track images locally (no API calls yet)
  const [currentImages, setCurrentImages] = useState(subject.images);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const formId = "edit-subject-form";
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // total count for delete-button logic
  const totalCount = currentImages.length + newImageFiles.length;

  // 3) When `subject` prop changes, re-initialize local state
  useEffect(() => {
    setForm({
      subject_name: subject.subject_name,
      Age: subject.age.toString(),
      Gender: subject.gender,
      Email: subject.email,
      Phone: subject.phone,
      Aadhar: subject.aadhar,
    });
    setCurrentImages(subject.images);
    setDeletedImageIds([]);
    setNewImageFiles([]);
  }, [subject]);

  // 4) Metadata handlers
  const onField = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const onSelectGender = (v: string) => {
    setForm({ ...form, Gender: v });
  };

  // 5) Mark existing image for deletion (UI only)
  const markDeleteExisting = (imageId: string) => {
    if (totalCount <= 1) return;
    setCurrentImages((imgs) => imgs.filter((img) => img.id !== imageId));
    setDeletedImageIds((ids) => [...ids, imageId]);
  };

  // 6) Remove a newly selected file (UI only)
  const removeNewFile = (index: number) => {
    if (totalCount <= 1) return;
    setNewImageFiles((files) => {
      const copy = [...files];
      copy.splice(index, 1);
      return copy;
    });
  };

  // 7) Handle file selection (no upload until Save)
  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFiles((prev) => [...prev, file]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 8) Helpers to call the image endpoints (used only in submit)
  const deleteSubjectImg = (imgId: string) =>
    fetch(`${API_URL}/api/remove_subject_img/${imgId}`, { method: "DELETE" });

  const uploadSubjectImg = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return fetch(`${API_URL}/api/add_subject_img/${subject.id}`, {
      method: "POST",
      body: formData,
    });
  };

  // 9) Submit handler: batch‐submit metadata + all image changes
  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    // a) Always append subject_name (Flask requires it)
    const metaData = new FormData();
    metaData.append("subject_name", form.subject_name);
    if (form.Age !== subject.age.toString()) metaData.append("Age", form.Age);
    if (form.Gender !== subject.gender) metaData.append("Gender", form.Gender);
    if (form.Email !== subject.email) metaData.append("Email", form.Email);
    if (form.Phone !== subject.phone) metaData.append("Phone", form.Phone);
    if (form.Aadhar !== subject.aadhar) metaData.append("Aadhar", form.Aadhar);
    // We can omit “id” here, since the URL already contains the subject_id.

    try {
      // b) Build delete + upload Promises (but don’t execute until Promise.all)
      const uploadPromises = newImageFiles.map((f) => uploadSubjectImg(f));
      const deletePromises = deletedImageIds.map((imgId) =>
        deleteSubjectImg(imgId)
      );

      // c) Metadata API call
      const metadataPromise = fetch(`${API_URL}/api/edit_sub/${subject.id}`, {
        method: "POST",
        body: metaData,
      });

      // d) Wait for all three groups (deletes, uploads, metadata)
      // await Promise.all([
      //   ...uploadPromises,
      //   ...deletePromises,
      //   metadataPromise,
      // ]);

      // e) After success, parent re-fetches and modal closes
      onEditSuccess();
      onClose();
    } catch (err) {
      console.error("Error saving edits:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // 10) Modal footer buttons
  const footer = (
    <>
      <Button
        variant="primary"
        className="ml-3 min-w-[100px]"
        type="submit"
        form={formId}
        disabled={submitting}
      >
        {submitting ? "Saving…" : "Save"}
      </Button>
      <Button variant="secondary" className="min-w-[100px]" onClick={onClose}>
        Cancel
      </Button>
    </>
  );

  return (
    <Modal
      title="Edit Subject"
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
    >
      <form id={formId} onSubmit={submit} className="space-y-4">
        {/* Metadata fields */}
        <div className="grid md:grid-cols-3 gap-4">
          <Input
            label="Name"
            name="subject_name"
            value={form.subject_name}
            onChange={onField}
            placeholder="Enter name"
            disabled
          />
          <Input
            label="Age"
            name="Age"
            type="number"
            value={form.Age}
            onChange={onField}
            placeholder="Enter age"
          />
          <Select
            label="Gender"
            value={form.Gender}
            options={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Other", label: "Other" },
            ]}
            onChange={onSelectGender}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Email"
            name="Email"
            type="email"
            value={form.Email}
            onChange={onField}
            placeholder="Enter email"
          />
          <Input
            label="Phone"
            name="Phone"
            value={form.Phone}
            onChange={onField}
            placeholder="Enter phone"
          />
        </div>
        <Input
          label="Aadhar"
          name="Aadhar"
          value={form.Aadhar}
          onChange={onField}
          placeholder="Enter Aadhar number"
        />

        {/* Thumbnails (existing and newly added) */}
        <div className="flex flex-wrap gap-2 mt-2">
          {currentImages.map((image) => (
            <div
              key={image.id}
              className="relative w-12 h-12 rounded-full border-2 border-white overflow-visible"
            >
              <img
                src={image.url}
                alt={`${subject.subject_name} profile`}
                className="rounded-full w-full h-full object-cover cursor-pointer"
              />
              {totalCount > 1 && (
                <button
                  onClick={() => markDeleteExisting(image.id)}
                  className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center"
                  title="Mark for deletion"
                  type="button" // <-- ensure this button is NOT a submit
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {newImageFiles.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return (
              <div
                key={`new-${idx}`}
                className="relative w-12 h-12 rounded-full border-2 border-white overflow-visible"
              >
                <img
                  src={previewUrl}
                  alt="Pending upload"
                  className="rounded-full w-full h-full object-cover cursor-pointer"
                />
                {totalCount > 1 && (
                  <button
                    onClick={() => removeNewFile(idx)}
                    className="absolute top-0 right-0 -mt-1 -mr-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center"
                    title="Remove pending image"
                    type="button" // <-- ensure this button is NOT a submit
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}

          {/* “+” button and hidden file input, wrapped in stopPropagation so modal doesn’t close */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="mt-1 relative w-10 h-10 flex items-center justify-center rounded-full border-2 border-dashed border-gray-300"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 hover:text-gray-500"
              title="Add image"
            >
              <Plus size={16} />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={onFileChange}
              hidden
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default EditSubjectModal;
