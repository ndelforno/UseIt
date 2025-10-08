import React, { useEffect, useState } from "react";
import { AuthForm } from "../Components/AuthForm";
import { registerUser } from "../api/auth";
import { useAuth } from "../Components/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { isLoggedIn, login, authLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      if (user?.isProfileComplete) {
        navigate("/", { replace: true });
      } else {
        navigate("/complete-profile", { replace: true });
      }
    }
  }, [authLoading, isLoggedIn, user, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData.email, formData.password);
      await login(formData.email, formData.password);
      navigate("/complete-profile", { replace: true });
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
