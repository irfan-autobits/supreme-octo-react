import React from 'react';
import Card from '../../components/UI/Card';

interface Meeting {
  id: number;
  type: string;
  date: string;
  time: string;
  duration: string;
  person: string;
}

interface MeetingCardProps {
  meeting: Meeting;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting }) => {
  return (
    <Card>
      <div className="text-sm">
        <h3 className="font-medium text-gray-800 mb-1">{meeting.type}</h3>
        <p className="text-gray-600 mb-1">{meeting.date}, {meeting.time}</p>
        <p className="text-gray-600">Duration : {meeting.duration}</p>
      </div>
    </Card>
  );
};

export default MeetingCard;