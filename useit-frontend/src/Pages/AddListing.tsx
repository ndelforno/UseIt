import { useState } from "react";

import { submitTool, Tool } from "../Types/Tool";
import { useAuth } from "../Components/AuthContext";
import { useNavigate } from "react-router-dom";
import { TOOL_CATEGORIES } from "../Types/Constants";
import { addTool, uploadImage } from "../api/tools";

export default function AddListing() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  if (!isLoggedIn) {
    navigate("/login");
  }

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<string>("");
  const [postalCode, setPostalCode] = useState("");
  const [area, setArea] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};

    if (!name.trim()) e.name = "Name is required.";
    if (!price.trim()) e.price = "Price is required.";
    else if (Number.isNaN(Number(price)) || Number(price) < 0)
      e.price = "Enter a valid price.";
    if (!postalCode.trim()) e.postalCode = "Postal code is required.";

    if (!area.trim()) e.area = "Area is required.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setCategory("");
    setPrice("");
    setPostalCode("");
    setArea("");
    setImage(null);
    setErrors({});
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSuccessMsg("");
    if (!validate()) return;

    let imageUrl = "";

    if (image) {
      const formData = new FormData();
      formData.append("file", image);

      imageUrl = await uploadImage(image);
    }

    const tool: submitTool = {
      name: name.trim(),
      description: description.trim(),
      category: category.trim(),
      price: Number(price).toString(),
      postalCode: postalCode.trim().toUpperCase(),
      area: area.trim(),
      imageUrl: imageUrl.trim(),
      isAvailable: true,
    };

    try {
      setSubmitting(true);
      await addTool(tool as Tool);
      setSuccessMsg("Tool added successfully.");
      resetForm();
      navigate("/myaccount");
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        form: "Failed to add tool. Please try again.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow space-y-4 bg-white m-6"
    >
      <h2 className="text-2xl font-semibold">Add New Listing</h2>

      {errors.form && (
        <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
          {errors.form}
        </div>
      )}
      {successMsg && (
        <div className="p-3 rounded bg-green-50 text-green-700 text-sm">
          {successMsg}
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Tool Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {errors.name && (
          <p className="text-xs text-red-600 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded min-h-24"
        />
      </div>

      <div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a category</option>
          {TOOL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-xs text-red-600 mt-1">{errors.category}</p>
        )}
      </div>

      <div>
        <input
          type="number"
          placeholder="Price (per day)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          min="0"
          step="0.01"
          required
        />
        {errors.price && (
          <p className="text-xs text-red-600 mt-1">{errors.price}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Postal Code"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {errors.postalCode && (
          <p className="text-xs text-red-600 mt-1">{errors.postalCode}</p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Area (e.g., Downtown, North York)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        {errors.area && (
          <p className="text-xs text-red-600 mt-1">{errors.area}</p>
        )}
      </div>

      <div className="space-y-4">
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors"
        >
          <span className="sr-only">Choose image</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />

          {image ? (
            <div className="space-y-4 w-full">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <p className="text-sm text-center text-gray-500">
                Click to change image
              </p>
            </div>
          ) : (
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                Click to upload an image
              </p>
            </div>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Submit Listing"}
      </button>
    </form>
  );
}
