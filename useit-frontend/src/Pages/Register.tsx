import React, { useState } from "react";
import { AuthForm } from "../Components/AuthForm";
import { registerUser } from "../Api";

export default function Register() {
  const [formData, setFormData] = useState({ email: "", password: "" });

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
