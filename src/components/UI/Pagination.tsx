// project/src/components/UI/Pagination.tsx
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="p-4 flex justify-center">
      <nav className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => onPageChange(idx + 1)}
            className={`px-3 py-1 ${
              currentPage === idx + 1
                ? "bg-purple-100 text-purple-700 rounded-md"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {idx + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          &gt;
        </button>
      </nav>
    </div>
  );
}
