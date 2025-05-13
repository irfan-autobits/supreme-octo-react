import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LineChart, Camera, Users, FileText, User } from 'lucide-react';
import Logo from '../UI/Logo';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-56 bg-white h-full flex flex-col shadow-sm">
      <div className="p-4 border-b">
        <Logo />
      </div>
      
      <nav className="flex-1 py-4">
        <NavItem to="/" icon={<LayoutDashboard size={20} />} text="Dashboard" />
        <NavItem to="/analysis" icon={<LineChart size={20} />} text="Analysis" />
        <NavItem to="/camera-manager" icon={<Camera size={20} />} text="Camera Manager" />
        <NavItem to="/person-tracker" icon={<Users size={20} />} text="Person Tracker" />
        <NavItem to="/subject-manager" icon={<FileText size={20} />} text="Subject Manager" />
      </nav>
      
      <div className="p-4 border-t flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <User size={16} />
        </div>
        <span className="ml-3 text-sm font-medium text-gray-700">ByeWind</span>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, text }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-sm ${
          isActive
            ? 'bg-purple-100 text-purple-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </NavLink>
  );
};

export default Sidebar;