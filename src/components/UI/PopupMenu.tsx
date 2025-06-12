// project/src/components/UI/PopupMenu.tsx
import React, { useRef, useEffect } from "react";

interface PopupMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
}

const PopupMenu: React.FC<PopupMenuProps> = ({ isOpen, onClose, className = "", children }) => {
  const menuRef = useRef<HTMLDivElement>(null);
    console.log("popup opened",isOpen)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      console.log("outsideclicked", isOpen);

      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div onClick={(e) => e.stopPropagation()} ref={menuRef} className={`absolute z-10 bottom-full mb-2 right-0 bg-white shadow-lg rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default PopupMenu;
