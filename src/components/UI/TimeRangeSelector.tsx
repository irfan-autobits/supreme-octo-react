// src/components/UI/TimeRangeSelector.tsx
import React from 'react';
import { ChevronDown } from 'lucide-react';

interface TimeRangeSelectorProps {
  preset: 'today' | 'yesterday' | 'custom';
  onPresetChange: (preset: 'today' | 'yesterday' | 'custom') => void;
  onCustomClick: () => void;
  customLabel: string;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  preset,
  onPresetChange,
  onCustomClick,
  customLabel
}) => {
  const options = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'custom', label: 'Custom Date' },
  ];

  return (
    <div className="flex gap-2">
      <select
        className="px-3 py-2 rounded border"
        value={preset}
        onChange={(e) => onPresetChange(e.target.value as any)}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {preset === 'custom' && (
        <button 
          onClick={onCustomClick}
          className="px-3 py-2 rounded border flex items-center"
        >
          {customLabel}
          <ChevronDown className="ml-2" size={16} />
        </button>
      )}
    </div>
  );
};

export default TimeRangeSelector;

1