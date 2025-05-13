import React, { useState } from 'react';
import Select from '../components/UI/Select';
import DatePicker from '../components/UI/DatePicker';
import Button from '../components/UI/Button';
import { mockMeetings } from '../utils/mockData';
import MeetingCard from '../features/Persons/MeetingCard';

const PersonTracker: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState('Irfan');
  const [fromDate, setFromDate] = useState('2025-04-30');
  const [endDate, setEndDate] = useState('2025-05-02');
  const [meetings, setMeetings] = useState(mockMeetings);

  const personOptions = [
    { value: 'Irfan', label: 'Irfan' },
    { value: 'Paresh', label: 'Paresh' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Person Tracker</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Select 
            label="Person" 
            options={personOptions} 
            value={selectedPerson}
            onChange={setSelectedPerson}
          />
          
          <DatePicker 
            label="From date" 
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          
          <DatePicker 
            label="End date" 
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          
          <Button variant="primary">
            Show Journey
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {meetings.map((meeting) => (
          <MeetingCard key={meeting.id} meeting={meeting} />
        ))}
      </div>
    </div>
  );
};

export default PersonTracker;