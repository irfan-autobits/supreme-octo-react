// project/src/components/UI/Logo.tsx
import React from 'react';
// import { Snowflake } from 'lucide-react';
import { AutobitsLogo } from "../../assets/icons/svgs.tsx";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      {/* <svg width="224" height="77">
        <rect width="224" height="77" fill="blue" />
      </svg> */}
      
      <AutobitsLogo height='440px' />
      {/* <Snowflake size={24} className="text-blue-500" /> */}
      {/* <span className="ml-2 text-gray-800 text-xl font-medium">snowUI</span> */}
    </div>
  );
};

export default Logo;