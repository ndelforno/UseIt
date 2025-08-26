import React from "react";

type AuthFormProps = {
  title: string;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: { email: string; password: string };
  setFormData: (data: { email: string; password: string }) => void;
};

export const AuthForm: React.FC<AuthFormProps> = ({ title, onSubmit, formData, setFormData }) => {
  return (
    <form onSubmit={onSubmit} className="max-w-sm mx-auto mt-10 p-4 border rounded shadow space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        {title}
      </button>
    </form>
  );
};
