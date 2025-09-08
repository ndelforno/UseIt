import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchToolById } from "../Api";
import { Tool } from "../Types/Tool";

export default function ToolDetail() {
  const { id } = useParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const tool = await fetchToolById(id);
        setTool(tool);
      } catch (e) {
        setError("Unable to load tool details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!tool) return <div className="p-6">Tool not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <Link to="/tools" className="text-sm text-blue-600 hover:underline">
        ← Back to Tools
      </Link>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {tool.imageUrl ? (
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${tool.imageUrl}`}
              alt={tool.name}
              className="w-full h-64 object-cover rounded-lg border"
            />
          ) : (
            <div className="w-full h-64 rounded-lg bg-slate-200" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{tool.name}</h1>
          <div className="text-slate-600 mt-1">
            {tool.area} • {tool.postalCode}
          </div>
          <div className="text-xl font-medium mt-2">{tool.price}/day</div>
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Category
            </div>
            <div>{tool.category || "—"}</div>
          </div>
          <div className="mt-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Availability
            </div>
            <div>{tool.isAvailable ? "Available" : "Unavailable"}</div>
          </div>
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Description
            </div>
            <p className="mt-1 whitespace-pre-line">
              {tool.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
