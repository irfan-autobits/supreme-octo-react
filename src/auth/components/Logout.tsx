// src/auth/components/Logout.tsx
import React, { useEffect } from "react";
import { useAuthContext } from "../AuthContext";

const Logout: React.FC = () => {
  const { logout } = useAuthContext();

  useEffect(() => {
    logout();
  }, [logout]);

  return <p>Logging out...</p>;
};

export default Logout;