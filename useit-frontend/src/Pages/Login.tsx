import React, { useState } from "react";
import { AuthForm } from "../Components/AuthForm";
import { loginUser } from "../Api";
import { Navigate } from 'react-router-dom'

interface LoginProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function Login({ setIsLoggedIn }: LoginProps) {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await loginUser(formData.email, formData.password);
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      alert("Login successful!");
      Navigate({to: '/'});
    } catch (err) {
      alert("Login failed");
    }
  };

  return <AuthForm title="Login" onSubmit={handleLogin} formData={formData} setFormData={setFormData} />;
}
