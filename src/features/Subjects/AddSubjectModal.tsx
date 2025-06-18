// project/src/features/Subjects/AddSubjectModal.tsx
import React, {
  useState,
  useEffect,
  ChangeEvent,
  FormEvent,
  useRef,
} from "react";
import Modal from "../../components/UI/Modal";
import Button from "../../components/UI/Button";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import { Plus } from "lucide-react";
import { ImageObj } from "./types";

const API_URL = import.meta.env.VITE_API_URL!;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Call this so SubjectManager can refresh its list */
  onAddSuccess: () => void;
}

const AddSubjectModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAddSuccess,
}) => {
  /* -------- form state -------- */
  const [form, setForm] = useState({
    subject_name: "",
    Age: "",
    Gender: "Male",
    Email: "",
    Phone: "",
    Aadhar: "",
  });

  const [imagesPrew, setimagesPrew] = useState("Choose Images");
  const [images, setImages] = useState<FileList>([]);
  const [csv, setCsv] = useState<File | null>("");
  const [submitting, setSubmitting] = useState(false);
  const formId = "add-subject-form";

  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [currentImages, setCurrentImages] = useState<ImageObj[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [newImageFiles, setNewImageFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const totalCount = currentImages.length + newImageFiles.length;

  /* -------- handlers -------- */
  const onField = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const hasDetails = Object.values(form).some((v) => v);
    if (!hasDetails && !csv) {
      alert("Fill subject details or choose CSV");
      return;
    }

    const data = new FormData();
    if (images) [...images].forEach((f) => data.append("file", f));
    newImageFiles.forEach((f) => data.append("file", f));
    if (csv) data.append("csv", csv);
    if (hasDetails) Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append("mode", activeTab);

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/add_sub`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      console.log("Subject added:", result);
      onAddSuccess();
      onClose();
    } catch (err) {
      console.error("add_sub error", err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      newImageFiles.forEach((file) =>
        URL.revokeObjectURL(URL.createObjectURL(file))
      );
    };
  }, [newImageFiles]);

  /* -------- modal footer -------- */
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
        {" "}
        Cancel{" "}
      </Button>
    </>
  );
  function trimString(str: string, maxLength: number): string {
    if (str) {
      return str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
    } else {
      return "Choose CSV";
    }
  }

  const handleDownload = async () => {
    const response = await fetch(API_URL + "/download/sample_add.csv", {
      method: "GET",
      headers: {
        // Authorization: `Bearer ${token}` if needed
      },
    });
    console.log(response);
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sample.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <Modal
      title="Add Subject"
      isOpen={isOpen}
      onClose={onClose}
      footer={footer}
    >
      <form id={formId} onSubmit={submit} className="space-y-4">
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "single"
                ? "text-[#85AF49] border-b-2 border-[#85AF49]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("single")}
          >
            Single Add
          </button>
          <button
            type="button"
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "bulk"
                ? "text-[#85AF49] border-b-2 border-[#85AF49]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("bulk")}
          >
            Bulk Add
          </button>
        </div>
        <input type="hidden" name="mode" value={activeTab} />

        {activeTab === "single" ? (
          <>
            {/*  */}
            <div className="grid md:grid-cols-3 gap-4">
              <Input
                label="Name"
                name="subject_name"
                value={form.subject_name}
                onChange={onField}
                placeholder="Enter name"
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
                onChange={(v) => setForm({ ...form, Gender: v })}
              />
            </div>
            {/*  grid-cols-1 */}
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Email"
                name="Email"
                type="Email"
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
                    alt={`${form.subject_name} profile`}
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
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {/* upload fields */}
            <span
              onClick={handleDownload}
              className="mr-auto border border-zinc-400 cursor-pointer text-zinc-400 px-4 py-2 rounded hover:shadow-md"
            >
              Download Sample CSV
            </span>
            <div className="flex gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Image(S)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="px-4 py-2 bg-[#85AF49] text-white rounded cursor-pointer hover:shadow-md hover:bg-zinc-400">
                    Browse
                    <input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => {
                        let str =
                          Object.keys(e.target.files).length + " Images Selected";
                        setimagesPrew(str);
                        setImages(e.target.files);
                      }}
                      // onChange={handleFileChange}
                      className="hidden"
                      />
                  </label>
                  <span className="text-gray-400">{imagesPrew}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload CSV (for Bulk Import)
                </label>
                <div className="flex items-center space-x-4">
                  <label className="px-4 py-2 bg-[#85AF49] text-white rounded cursor-pointer hover:shadow-md hover:bg-zinc-400">
                    Browse
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsv(e.target.files?.[0] || null)}
                      // onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-400">
                    {trimString(csv?.name, 10)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

export default AddSubjectModal;
