// project/src/components/Layout/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  LineChart,
  Camera,
  Users,
  FileText,
  User as UserIcon,
} from "lucide-react";
import { Radar, Scan, View, Eye } from "lucide-react";
import Logo from "../UI/Logo";
import { useAuthContext } from "../../auth/AuthContext";
import PopupMenu from "../../components/UI/PopupMenu";

const Sidebar: React.FC = () => {
  // Get token from auth context
  const { token } = useAuthContext();
  const [showPopup, setShowPopup] = React.useState(false);
  const { logout } = useAuthContext();
  const handleLogout = () => {
      logout();
  }
  // Decode user email from JWT token
  let username = "Guest";
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      username = payload.email || username;
    } catch {
      // ignore invalid token
    }
  }

  return (
    <aside className="w-64 bg-white h-full flex flex-col shadow-sm">
      <div className="px-[40px] py-[25px]">
        <Logo />
      </div>

      <nav className="flex-1 py-4">
        <NavItem
          to="/dashboard"
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
        />
        <NavItem
          to="/analysis"
          icon={<LineChart size={20} />}
          text="Analysis"
        />
        <NavItem
          to="/camera-manager"
          icon={<Camera size={20} />}
          text="Camera Manager"
        />
        <NavItem
          to="/person-tracker"
          icon={<Users size={20} />}
          text="Person Tracker"
        />
        <NavItem
          to="/subject-manager"
          icon={<FileText size={20} />}
          text="Person Manager"
        />
        <NavItem
          to="/detection-tab"
          icon={<Eye size={20} />}
          text="Detectoin Table"
        />
      </nav>

      <div
        className="p-4 flex items-center relative"
        // Stop propagation on the toggle container so that PopupMenu’s document listener
        // does not see this click as an “outside” click.
        onClick={(e) => {
          e.stopPropagation();
          setShowPopup((prev) => !prev);
          console.log("Sidebar: clicked user, toggling popup →", !showPopup);
        }}
      >
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <UserIcon size={16} />
        </div>
        <span className="ml-3 text-sm font-medium text-gray-700">
          {username}
        </span>

        <PopupMenu
          isOpen={showPopup}
          onClose={() => {
            console.log("Sidebar: PopupMenu requested close");
            setShowPopup(false);
          }}
          className="w-1/2 absolute z-10 bottom-full bg-white shadow-lg rounded-lg left-1/2 transform -translate-x-1/2"
        >
          {/* Now we can just pass the children normally (no need for `children=` prop) */}
          <button
            className="flex w-full px-4 py-2 text-sm text-center hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation(); // in case the button click bubble up
              setShowPopup(false);
              console.log("Sidebar: clicked ‘Log out’");
              handleLogout();
              // … do logout logic here …
            }}
          >
            <span >Log out</span>
          </button>
        </PopupMenu>
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
    <div className="px-3 py-1">
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-6 py-4 text-sm ${
            isActive
              ? "rounded-xl bg-[var(--ab-pr)] text-white font-medium"
              : "rounded-xl text-black hover:bg-[var(--pr-lt)]  "
          }`
        }
      >
        <span className="mr-3">{icon}</span>
        <span>{text}</span>
      </NavLink>
    </div>
  );
};

export default Sidebar;
