import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

import { Tool } from "../Types/Tool";
import { useAuth } from "../Components/AuthContext";
import { fetchToolById } from "../api/tools";
import {
  reserveTool,
  fetchToolReservations,
  updateReservationStatus,
} from "../api/reservations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToolReservation } from "../Types/Reservation";
import { ReservationStatus } from "../Types/Constants";

export default function ToolDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [reserveMsg, setReserveMsg] = useState("");
  const [pendingReservations, setPendingReservations] = useState<
    ToolReservation[]
  >([]);
  const navigate = useNavigate();

  const {
    data: tool,
    isLoading,
    error,
  } = useQuery<Tool, Error>({
    queryKey: ["tool", id],
    queryFn: () => fetchToolById(id as string),
    enabled: !!id,
  });

  const { data: reservations = [] } = useQuery<Array<ToolReservation>, Error>({
    queryKey: ["toolReservations", id],
    queryFn: () => fetchToolReservations(id as string),
    enabled: !!id,
    staleTime: 60_000,
  });

  const toDateOnly = (d: Date | string) => {
    const dt = typeof d === "string" ? new Date(d) : d;
    return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
  };

  const handleReserve = async () => {
    setReserveMsg("");
    if (!startDate || !endDate) {
      alert("Please select start and end dates.");
      return;
    }
    try {
      await reserveTool({
        toolId: id as string,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });
      setReserveMsg("Reservation confirmed!");
      queryClient.invalidateQueries({ queryKey: ["tool", id] });
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({
        queryKey: ["toolReservations", id],
      });
      navigate("/myaccount");
    } catch (e: any) {
      alert(e?.message || "Failed to reserve tool.");
    }
  };

  const disabledIntervals = useMemo(() => {
    return reservations.map((r: ToolReservation) => ({
      start: toDateOnly(r.startDate),
      end: toDateOnly(r.endDate), // inclusive range
    }));
  }, [reservations]);

  const handleReservationRequest = async (
    status: ReservationStatus,
    reservationId: number
  ) => {
    try {
      await updateReservationStatus(reservationId, status);
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["incomingReservations"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["toolReservations", id],
        }),
      ]);
    } catch (e: any) {
      alert(e?.message || "Failed to update reservation");
    }
  };

  useEffect(() => {
    const pendingReservations = reservations.filter(
      (r) => r.status === ReservationStatus.Pending
    );
    setPendingReservations(pendingReservations);
  }, [reservations]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-600">{error.message || "Error"}</div>;
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
            <div className="text-sm">Select dates to check availability.</div>
          </div>
          <div className="mt-6">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Description
            </div>
            <p className="mt-1 whitespace-pre-line">
              {tool.description || "No description provided."}
            </p>
          </div>

          {isOwner && pendingReservations.length > 0 && (
            <div className="mt-6 border-t pt-4">
              <div className="text-lg font-medium mb-2">
                Pending reservations
              </div>
              <div className="space-y-2">
                {reservations.map((r: ToolReservation) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div>
                      {new Date(r.startDate).toLocaleDateString()} —{" "}
                      {new Date(r.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="px-3 py-1 rounded bg-green-600 text-white"
                        onClick={() => {
                          handleReservationRequest(
                            ReservationStatus.Active,
                            r.id
                          );
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="px-3 py-1 rounded bg-red-600 text-white"
                        onClick={() => {
                          handleReservationRequest(
                            ReservationStatus.Cancelled,
                            r.id
                          );
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isOwner && user && (
            <div className="mt-6 border-t pt-4">
              <div className="text-lg font-medium mb-2">Reserve this tool</div>
              {reserveMsg && (
                <div className="mb-2 text-green-700 bg-green-50 p-2 rounded text-sm">
                  {reserveMsg}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date as Date | null)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start date"
                  excludeDateIntervals={disabledIntervals}
                  className="border rounded px-2 h-10"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date as Date | null)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate || undefined}
                  placeholderText="End date"
                  excludeDateIntervals={disabledIntervals}
                  className="border rounded px-2 h-10"
                />
                <button
                  className="bg-blue-600 text-white rounded px-4 h-10"
                  onClick={handleReserve}
                  disabled={!startDate || !endDate}
                >
                  Reserve
                </button>
              </div>
            </div>
          )}
          {!isOwner && !user && (
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
