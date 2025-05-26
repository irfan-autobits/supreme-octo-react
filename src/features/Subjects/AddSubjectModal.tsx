// project/src/features/Subjects/AddSubjectModal.tsx
import React, { useState, ChangeEvent, FormEvent } from "react";
import Modal  from "../../components/UI/Modal";
import Button from "../../components/UI/Button";
import Input  from "../../components/UI/Input";
import Select from "../../components/UI/Select";

const API_URL = import.meta.env.VITE_API_URL!;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Call this so SubjectManager can refresh its list */
  onAddSuccess: () => void;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Call this so SubjectManager can refresh its list */
  onAddSuccess: () => void;
}

const AddSubjectModal: React.FC<Props> = ({ isOpen, onClose, onAddSuccess }) => {
  /* -------- form state -------- */
  const [form, setForm] = useState({
    subject_name: "",
    Age: "",
    Gender: "Male",
    Email: "",
    Phone: "",
    Aadhar: "",
  });

  const [images, setImages] = useState<FileList | null>(null);
  const [csv,    setCsv]    = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const formId = "add-subject-form";

  /* -------- handlers -------- */
  const onField = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const printing = () => {
    console.log("save button clicked");
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const hasDetails = Object.values(form).some(v => v);
    if (!hasDetails && !csv) { alert("Fill subject details or choose CSV"); return; }

    const data = new FormData();
    if (images) [...images].forEach(f => data.append("file", f));
    if (csv)    data.append("csv", csv);
    if (hasDetails) Object.entries(form).forEach(([k,v]) => data.append(k, v));

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/add_sub`, { method: "POST", body: data });
      const result = await response.json();
      console.log("Subject added:", result);
      console.log("set submit",submitting )
      onAddSuccess();
      onClose();
    } catch (err) {
      console.error("add_sub error", err);
    } finally { setSubmitting(false); }
  };
    /* -------- modal footer -------- */
  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>Cancel</Button>
<Button
  variant="primary"
  className="ml-3"
  type="submit"
  form={formId}               
  disabled={submitting}
>
  {submitting ? "Saving…" : "Save"}
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
      <form id={formId} onSubmit={submit} className="space-y-4">
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
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' }
            ]}
            onChange={v => setForm({ ...form, Gender: v })}
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
        
        {/* upload fields */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Image(S)
            </label>
                       <Input type="file" multiple onChange={e=>setImages(e.target.files)}/>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload CSV (for Bulk Import)
            </label>
                        <Input type="file" accept=".csv" onChange={e=>setCsv(e.target.files?.[0]||null)}/>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddSubjectModal;