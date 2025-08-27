import React, { useState } from "react";
import { AuthForm } from "../Components/AuthForm";
import { loginUser } from "../Api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await loginUser(formData.email, formData.password);
      localStorage.setItem("token", token);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <AuthForm
      title="Login"
      onSubmit={handleLogin}
      formData={formData}
      setFormData={setFormData}
    />
  );
}
