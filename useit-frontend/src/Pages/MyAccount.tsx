import { useEffect, useState } from "react";
import { useAuth } from "../Components/AuthContext";
import { fetchMyTools, deleteTool } from "../Api";
import { Tool } from "../Types/Tool";
import { ListingCard } from "../Components/ui/ListingCard";
import { Link, useNavigate } from "react-router-dom";

export default function MyAccount() {
  const [tools, setTools] = useState<Tool[]>([]);
  const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const data = fetchMyTools();
    data.then((res) => setTools(res));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <p>Welcome {user?.email} !</p>
      <p>Here you can manage your account settings and view your activity.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">Listings</h2>
      {error && (
        <div className="p-2 mb-3 rounded bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {tools.map((tool) => (
          <div key={tool.id} className="space-y-2">
            <ListingCard
              title={tool.name}
              area={tool.area}
              price={tool.price}
              imageUrl={tool.imageUrl}
            />
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigate(`/editlisting/${tool.id}`);
                }}
                className="inline-block text-sm text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                className="inline-block text-sm text-red-600 hover:underline"
                onClick={async () => {
                  setError("");
                  const confirmed = window.confirm(
                    `Delete "${tool.name}"? This cannot be undone.`
                  );
                  if (!confirmed) return;
                  try {
                    await deleteTool(tool.id);
                    setTools((prev) => prev.filter((t) => t.id !== tool.id));
                  } catch (e) {
                    setError("Failed to delete listing. Please try again.");
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
