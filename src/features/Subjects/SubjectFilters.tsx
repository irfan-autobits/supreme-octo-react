// src/components/SubjectFilters.tsx
import React from "react";
import { Search, X } from "lucide-react";
import Input from "../../components/UI/Input";
import Select from "../../components/UI/Select";
import Button from "../../components/UI/Button";

interface SubjectFiltersProps {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  personOptions: { label: string; value: string }[];
  selectedSubject: string;
  setSelectedSubject: (s: string) => void;
  onClearFilters: () => void;
}

export default function SubjectFilters({
  searchTerm,
  setSearchTerm,
  personOptions,
  selectedSubject,
  setSelectedSubject,
  onClearFilters,
}: SubjectFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 max-w-3xl p-4 border-b border-gray-200">
      <div className="flex-1 min-w-[200px]">
        <Input
          icon={<Search size={16} className="text-gray-400" />}
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex-1 min-w-[200px]">
        <Select
          label="Person"
          options={personOptions}
          value={selectedSubject}
          onChange={setSelectedSubject}
        />
      </div>
      
      <div>
        <Button variant="secondary" onClick={onClearFilters}>
          <X size={20} />
        </Button>
      </div>
    </div>
  );
}
