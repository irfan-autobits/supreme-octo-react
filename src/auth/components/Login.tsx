// src/auth/components/Login.tsx
import React, { useState, FormEvent } from "react";
import { useAuthContext } from "../AuthContext";
import { Link } from "react-router-dom";
import Button from "../../components/UI/Button";

const API_URL = import.meta.env.VITE_API_URL!;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

const Login: React.FC = () => {
  console.log("API URL:", API_URL);  
  const { login } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    // your backend returns { message, token }
    if (response.ok && data.token) {
      login(data.token);
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#85AF49]"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#85AF49]"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
          <Button variant="primary" className="w-full transition" type="submit">
            Login
          </Button>        
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Don’t have an account?
        <Link to="/register" className="text-[#85AF49] hover:underline">
           Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;