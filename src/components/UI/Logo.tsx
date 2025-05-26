// project/src/components/UI/Logo.tsx
import React from 'react';
import { Snowflake } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <Snowflake size={24} className="text-blue-500" />
      <span className="ml-2 text-gray-800 text-xl font-medium">snowUI</span>
    </div>
  );
};

export default Logo;