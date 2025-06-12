// project/src/components/UI/Select.tsx
import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  options: SelectOption[];
  label?: string;
  onChange?: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({
  options,
  label,
  onChange,
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (

    <div
      className="flex w-full flex-col gap-1 dateshow relative border rounded-md shadow-sm border px-3 py-2 sm:text-sm border-[#F5F5F6] "
    >
      <div className="text-zinc-500">{label && (label)}</div>
      
      <div className="relative">
        <select
          className="w-full bg-transparent px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#85AF49] appearance-none sm:text-sm"
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </div>

    // <div className="w-full">
    //   {label && (
    //     <label className="block text-sm font-medium text-gray-700 mb-1">
    //       {label}
    //     </label>
    //   )}
    //   <div className="relative rounded-md shadow-sm">
    //     <select
    //       className="w-full border rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#85AF49] appearance-none sm:text-sm"
    //       onChange={handleChange}
    //       {...props}
    //     >
    //       {options.map((option) => (
    //         <option key={option.value} value={option.value}>
    //           {option.label}
    //         </option>
    //       ))}
    //     </select>
    //     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
    //       <ChevronDown size={16} className="text-gray-400" />
    //     </div>
    //   </div>
    //   {/* {error && <p className="mt-1 text-sm text-red-600">{error}</p>} */}
    // </div>
  );
};

export default Select;
