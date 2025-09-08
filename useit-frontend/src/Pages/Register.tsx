import React, { useState } from "react";
import { AuthForm } from "../Components/AuthForm";
import { registerUser } from "../api/auth";
import { useAuth } from "../Components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate("/");
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData.email, formData.password);
      alert("Registered successfully!");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <>
      <p>
        Already have an account ? <a href="/login">Login</a>
      </p>
      <AuthForm
        title="Register"
        onSubmit={handleRegister}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  );
}
