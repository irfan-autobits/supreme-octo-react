// project/src/components/Layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, LineChart, Camera, Users, FileText, User as UserIcon } from 'lucide-react';
import Logo from '../UI/Logo';
import { useAuthContext } from '../../auth/AuthContext';

const Sidebar: React.FC = () => {
  // Get token from auth context
  const { token } = useAuthContext();

  // Decode user email from JWT token
  let username = 'Guest';
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      username = payload.email || username;
    } catch {
      // ignore invalid token
    }
  }

  return (
    <aside className="w-56 bg-white h-full flex flex-col shadow-sm">
      <div className="p-4 border-b">
        <Logo />
      </div>
      
      <nav className="flex-1 py-4">
        <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} text="Dashboard" />
        <NavItem to="/analysis" icon={<LineChart size={20} />} text="Analysis" />
        <NavItem to="/camera-manager" icon={<Camera size={20} />} text="Camera Manager" />
        <NavItem to="/person-tracker" icon={<Users size={20} />} text="Person Tracker" />
        <NavItem to="/subject-manager" icon={<FileText size={20} />} text="Subject Manager" />
      </nav>
      <div className="p-4 border-t flex items-center">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <UserIcon size={16} />
        </div>
        <span className="ml-3 text-sm font-medium text-gray-700">{username}</span>
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