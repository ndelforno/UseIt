import { useState } from "react";
import { useAuth } from "../Components/AuthContext";

import { MyTool } from "../Types/Tool";
import { Reservation } from "../Types/Reservation";
import { ListingCard } from "../Components/ui/ListingCard";
import { Button } from "../Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
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
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl">My activities</CardTitle>
              <CardDescription>
                Welcome {user?.userName || user?.displayName || user?.email}
              </CardDescription>
            </div>
            <div className="text-sm text-slate-500">{user?.email}</div>
          </CardHeader>
          {!user?.isProfileComplete && (
            <CardContent>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-700">
                Complete your profile so renters know who you are.{' '}
                <button
                  className="underline"
                  onClick={() => navigate("/complete-profile")}
                >
                  Update profile
                </button>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>My listings</CardTitle>
                <CardDescription>Manage the tools you share on UseIt</CardDescription>
              </div>
              {tools.length > 0 && (
                <Button
                  className="bg-slate-900 text-white hover:bg-slate-800"
                  onClick={() => navigate("/addlisting")}
                >
                  Add listing
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {tools.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  <p>
                    You haven&apos;t published any listings yet. Share your tools with the
                    community and start earning.
                  </p>
                  <Button className="mt-4" onClick={() => navigate("/addlisting")}>
                    Create your first listing
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {tools.map((tool) => (
                      <div key={tool.id} className="space-y-2">
                        <ListingCard
                          id={tool.id}
                          title={tool.name}
                          area={tool.area}
                          price={tool.price}
                          imageUrl={tool.imageUrl}
                          actions={
                            <>
                              <Button
                                size="icon"
                                variant="secondary"
                                className="rounded-full border border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
                                onClick={(e) => {
                                  e.preventDefault();
                                  navigate(`/editlisting/${tool.id}`);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="destructive"
                                className="rounded-full"
                                onClick={async (e) => {
                                  e.preventDefault();
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
                                  } catch (err) {
                                    setError("Failed to delete listing. Please try again.");
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          }
                        />
                        {tool.pendingCount && tool.pendingCount > 0 && (
                          <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 text-center">
                            {tool.pendingCount} pending reservation
                            {tool.pendingCount > 1 ? "s" : ""}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardHeader>
              <CardTitle>My reservations</CardTitle>
              <CardDescription>Track the tools you&apos;ve booked</CardDescription>
            </CardHeader>
            <CardContent>
              {reservations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                  You have no reservations yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => navigate(`/tool/${r.toolId}`)}
                      className="flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-amber-500 hover:shadow-md"
                    >
                      <div className="flex gap-3">
                        {r.tool?.imageUrl ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}${r.tool.imageUrl}`}
                            alt={r.tool.name}
                            className="h-20 w-20 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-lg bg-slate-200" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">{r.tool?.name}</div>
                          <div className="text-sm text-slate-500">
                            {r.tool?.area} • {r.tool?.price}
                          </div>
                          {(r.tool?.brand || r.tool?.model) && (
                            <div className="text-xs text-slate-500">
                              {[r.tool?.brand, r.tool?.model].filter(Boolean).join(" • ")}
                            </div>
                          )}
                          {r.tool?.deposit && (
                            <div className="text-xs text-slate-500">Deposit: {r.tool.deposit}</div>
                          )}
                          <div className="mt-1 text-sm text-slate-600">
                            {new Date(r.startDate).toLocaleDateString()} — {new Date(r.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-xs uppercase text-slate-500">Status: {r.status}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
