import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { Tool } from "../Types/Tool";
import { useAuth } from "../Components/AuthContext";
import { fetchToolById } from "../api/tools";
import { reserveTool } from "../api/reservations";

export default function ToolDetail() {
  const { id } = useParams();
  const [tool, setTool] = useState<Tool | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reserveMsg, setReserveMsg] = useState("");

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

  const isOwner = tool && user && user.id === tool.owner;

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

          {!isOwner && tool.isAvailable && user && (
            <div className="mt-6 border-t pt-4">
              <div className="text-lg font-medium mb-2">Reserve this tool</div>
              {reserveMsg && (
                <div className="mb-2 text-green-700 bg-green-50 p-2 rounded text-sm">
                  {reserveMsg}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded px-2 h-10"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded px-2 h-10"
                />
                <button
                  className="bg-blue-600 text-white rounded px-4 h-10"
                  onClick={async () => {
                    setError("");
                    setReserveMsg("");
                    if (!startDate || !endDate) {
                      setError("Please select start and end dates.");
                      return;
                    }
                    try {
                      await reserveTool({
                        toolId: id as string,
                        startDate: new Date(startDate).toISOString(),
                        endDate: new Date(endDate).toISOString(),
                      });
                      setReserveMsg("Reservation confirmed!");
                      setTool({ ...tool, isAvailable: false });
                    } catch (e: any) {
                      setError(e?.message || "Failed to reserve tool.");
                    }
                  }}
                >
                  Reserve
                </button>
              </div>
            </div>
          )}
          {!isOwner && tool.isAvailable && !user && (
            <div className="mt-6 border-t pt-4 text-sm">
              Please{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                log in
              </Link>{" "}
              to reserve this tool.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
