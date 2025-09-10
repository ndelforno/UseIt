import { useState } from "react";
import { useAuth } from "../Components/AuthContext";

import { MyTool } from "../Types/Tool";
import { Reservation } from "../Types/Reservation";
import { ListingCard } from "../Components/ui/ListingCard";
import { useNavigate } from "react-router-dom";
import { deleteTool, fetchMyTools } from "../api/tools";
import { fetchMyReservations } from "../api/reservations";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function MyAccount() {
  const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: tools = [] } = useQuery<MyTool[], Error>({
    queryKey: ["myTools"],
    queryFn: fetchMyTools,
  });
  const { data: reservations = [] } = useQuery<Reservation[], Error>({
    queryKey: ["myReservations"],
    queryFn: fetchMyReservations,
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <p>Welcome {user?.email} !</p>
      <p>Here you can manage your account settings and view your activity.</p>
      <h2 className="text-xl font-semibold mt-6 mb-2">My Listings</h2>
      {tools.length === 0 ? (
        <p className="text-sm text-slate-600">You have no listings yet.</p>
      ) : (
        <>
          {error && (
            <div className="p-2 mb-3 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {tools.map((tool) => (
              <div key={tool.id} className="space-y-2">
                <ListingCard
                  id={tool.id}
                  title={tool.name}
                  area={tool.area}
                  price={tool.price}
                  imageUrl={tool.imageUrl}
                />
                {tool.pendingCount && tool.pendingCount > 0 && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 text-center">
                    {tool.pendingCount} pending reservation
                    {tool.pendingCount > 1 ? "s" : ""}
                  </div>
                )}
                <div className="flex items-center justify-center gap-3">
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
                        await queryClient.invalidateQueries({
                          queryKey: ["myTools"],
                        });
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
        </>
      )}
      <h2 className="text-xl font-semibold mt-8 mb-2">My Reservations</h2>
      {reservations.length === 0 ? (
        <p className="text-sm text-slate-600">You have no reservations yet.</p>
      ) : (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reservations.map((r) => (
            <div key={r.id} className="border rounded-lg p-3 bg-white">
              <div className="flex gap-3">
                {r.tool?.imageUrl ? (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}${
                      r.tool.imageUrl
                    }`}
                    alt={r.tool.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                ) : (
                  <div className="w-20 h-20 rounded bg-slate-200" />
                )}
                <div className="flex-1">
                  <div className="font-medium">{r.tool?.name}</div>
                  <div className="text-sm text-slate-500">
                    {r.tool?.area} • {r.tool?.price}/day
                  </div>
                  <div className="text-sm mt-1">
                    {new Date(r.startDate).toLocaleDateString()} —{" "}
                    {new Date(r.endDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs mt-1">
                    Status: <span className="uppercase">{r.status}</span>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-right">
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => navigate(`/tool/${r.toolId}`)}
                >
                  View tool
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
