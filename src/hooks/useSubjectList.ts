// src/hooks/useSubjectList.ts
import { useState, useEffect } from "react";

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

export function useSubjectList(
  apiUrl: string,
  filterText: string,
  selectedName: string,
  refreshTrigger: number
) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data whenever refreshTrigger changes
  useEffect(() => {
    setLoading(true);
    fetch(`${apiUrl}/api/subject_list`)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data.subjects || []);
        setLoading(false);
      })
      .catch((_) => setLoading(false));
  }, [apiUrl, refreshTrigger]);

  // Apply search & dropdown filter
  const filtered = subjects.filter((subj) => {
    const matchesText =
      subj.subject_name.toLowerCase().includes(filterText.toLowerCase()) ||
      subj.email.toLowerCase().includes(filterText.toLowerCase());
    const matchesSelect = !selectedName || subj.subject_name === selectedName;
    return matchesText && matchesSelect;
  });

  return { subjects: filtered, allSubjects: subjects, loading };
}
