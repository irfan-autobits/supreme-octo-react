// project/src/components/UI/DatePicker.tsx
import React from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="datetime-local"
          className="block w-full rounded-md border-gray-300 pl-10 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          {...props}
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Calendar size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default DatePicker;