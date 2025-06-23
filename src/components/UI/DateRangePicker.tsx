// src/components/UI/DateRangePicker.tsx
import React from 'react';
import { DateRangeCalendarPicker } from 'react-datetime-range-super-picker';
import { format, parseISO } from 'date-fns';

interface DateRangePickerProps {
  startDate: string; // yyyy-MM-dd
  endDate: string;   // yyyy-MM-dd
  onApply: (start: string, end: string) => void;
  onCancel: () => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onApply,
  onCancel
}) => {
  const [fromDate, setFromDate] = useState(parseISO(startDate));
  const [toDate, setToDate] = useState(parseISO(endDate));

  const handleApply = () => {
    onApply(
      format(fromDate, 'yyyy-MM-dd'),
      format(toDate, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="absolute top-full right-0 bg-white p-4 shadow-lg z-10">
      <DateRangeCalendarPicker
        from_date={fromDate}
        to_date={toDate}
        onFromDateUpdate={(arg) => setFromDate(new Date(arg.date))}
        onToDateUpdate={(arg) => setToDate(new Date(arg.date))}
        format="yyyy-MM-dd"
      />
      <div className="flex justify-end gap-2 mt-4">
        <button 
          onClick={onCancel}
          className="px-4 py-2 border rounded"
        >
          Cancel
        </button>
        <button 
          onClick={handleApply}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default DateRangePicker;

1