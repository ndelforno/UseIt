import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Components/AuthContext";
import { updateMyProfile } from "../api/users";

export default function CompleteProfile() {
  const { user, authLoading, isLoggedIn, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!authLoading) {
      if (!isLoggedIn) {
        navigate("/login", { replace: true });
        return;
      }
      if (user?.isProfileComplete) {
        navigate("/myaccount", { replace: true });
      }
    }
  }, [authLoading, isLoggedIn, user, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
      });
    }
  }, [user]);

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!formData.phone.trim()) nextErrors.phone = "Phone is required.";
    if (!formData.address.trim()) nextErrors.address = "Address is required.";
    if (!formData.city.trim()) nextErrors.city = "City is required.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    try {
      setSaving(true);
      await updateMyProfile(formData);
      await refreshUser();
      navigate("/myaccount", { replace: true });
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Complete Your Profile</h1>
      <p className="text-sm text-slate-600 mb-6">
        Tell us a bit more about yourself. This helps other users know who they
        are renting from.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
            {submitError}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700">
            First name
          </label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            placeholder="Jane"
          />
          {errors.firstName && (
            <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Last name
          </label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            placeholder="(555) 555-5555"
          />
          {errors.phone && (
            <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Address
          </label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            placeholder="123 Main St"
          />
          {errors.address && (
            <p className="text-xs text-red-600 mt-1">{errors.address}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            City
          </label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded"
            placeholder="Toronto"
          />
          {errors.city && (
            <p className="text-xs text-red-600 mt-1">{errors.city}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save profile"}
        </button>
      </form>
    </div>
  );
}
