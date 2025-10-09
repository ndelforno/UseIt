import { useEffect, useMemo, useState, forwardRef } from "react";
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
import { Badge } from "../Components/ui/badge";
import { Button } from "../Components/ui/button";
import { CalendarIcon, CheckCircle2 } from "lucide-react";

const parseCurrency = (amount?: string) => {
  if (!amount) return null;
  const match = amount.match(/[-+]?[0-9]*[\.,]?[0-9]+/g);
  if (!match || match.length === 0) return null;
  const normalized = match[0].replace(/,/g, "");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
};

const formatCurrency = (value: number | null | undefined) =>
  value == null ? null : `$${value.toFixed(2)}`;

type DateInputButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  value?: string;
  placeholder?: string;
};

const DateInputButton = forwardRef<HTMLButtonElement, DateInputButtonProps>(
  ({ value, placeholder, className, ...rest }, ref) => (
    <button
      type="button"
      ref={ref}
      className={`flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-left text-sm text-slate-900 shadow-sm transition hover:border-amber-400 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 ${className ?? ""}`}
      {...rest}
    >
      <span className="flex items-center gap-2">
        <CalendarIcon className="h-4 w-4 text-slate-400" />
        <span className={value ? "text-slate-900" : "text-slate-400"}>
          {value || placeholder || "Select"}
        </span>
      </span>
    </button>
  )
);

DateInputButton.displayName = "DateInputButton";

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
      setReserveMsg("Reservation request sent!");
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
    reservationId: string
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
    const pending = reservations.filter(
      (r) => r.status === ReservationStatus.Pending
    );
    setPendingReservations(pending);
  }, [reservations]);

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (error)
    return <div className="p-6 text-red-600">{error.message || "Error"}</div>;
  if (!tool) return <div className="p-6">Tool not found.</div>;

  const isOwner = tool && user && user.id === tool.ownerId;
  const basePricePerDay = parseCurrency(tool.price ?? "");
  const dailyRateDisplay = basePricePerDay
    ? `${formatCurrency(basePricePerDay)} / day`
    : tool.price || "—";
  const formattedDeposit = formatCurrency(parseCurrency(tool.deposit ?? "")) ??
    (tool.deposit || null);
  const selectionSummary =
    startDate && endDate
      ? `${new Date(startDate).toLocaleDateString()} → ${new Date(
          endDate
        ).toLocaleDateString()}`
      : null;

  const reservationDays =
    startDate && endDate
      ? Math.max(
          1,
          Math.round(
            (toDateOnly(endDate).getTime() - toDateOnly(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const totalCost = basePricePerDay && reservationDays
    ? basePricePerDay * reservationDays
    : null;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link to="/tools" className="text-sm text-amber-600 hover:text-amber-700">
          ← Back to tools
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              {tool.imageUrl ? (
                <img
                  src={`${import.meta.env.VITE_API_BASE_URL}${tool.imageUrl}`}
                  alt={tool.name}
                  className="w-full h-[360px] sm:h-[460px] object-cover"
                />
              ) : (
                <div className="h-[360px] sm:h-[460px] bg-slate-100" />
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm p-6 space-y-6">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                  <span>{tool.area}</span>
                  <span>•</span>
                  <span>{tool.postalCode}</span>
                </div>
                <h1 className="text-3xl font-semibold text-slate-900">{tool.name}</h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="uppercase tracking-wide text-xs">
                    {tool.category || "Uncategorized"}
                  </Badge>
                  {tool.brand && (
                    <Badge variant="outline" className="text-xs">
                      Brand: {tool.brand}
                    </Badge>
                  )}
                  {tool.model && (
                    <Badge variant="outline" className="text-xs">
                      Model: {tool.model}
                    </Badge>
                  )}
                  {formattedDeposit && (
                    <Badge variant="outline" className="text-xs text-amber-600 border-amber-200">
                      Deposit {formattedDeposit}
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">Description</h2>
                <p className="mt-2 text-slate-600 whitespace-pre-line">
                  {tool.description || "No description provided."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Daily rate
                  </div>
                  <div className="mt-1 text-2xl font-semibold text-slate-900">
                    {dailyRateDisplay}
                  </div>
                  {formattedDeposit && (
                    <div className="text-sm text-slate-500 mt-1">
                      Deposit required: {formattedDeposit}
                    </div>
                  )}
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Location
                  </div>
                  <div className="mt-1 text-lg font-medium text-slate-900">
                    {tool.area || "—"}
                  </div>
                  <div className="text-sm text-slate-500">{tool.postalCode || ""}</div>
                </div>
              </div>
            </div>

            {isOwner && pendingReservations.length > 0 && (
              <div className="rounded-3xl border border-amber-200 bg-amber-50/60 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-amber-700">
                    Pending reservations
                  </h2>
                  <span className="text-xs font-medium text-amber-700">
                    {pendingReservations.length} awaiting action
                  </span>
                </div>
                <div className="space-y-3">
                  {pendingReservations.map((r) => (
                    <div
                      key={r.id}
                      className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="text-sm text-slate-700">
                        <div className="font-medium text-slate-900">
                          {new Date(r.startDate).toLocaleDateString()} →{" "}
                          {new Date(r.endDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500">Awaiting your response</div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          className="border-amber-500 text-amber-700"
                          onClick={() =>
                            handleReservationRequest(
                              ReservationStatus.Active,
                              r.id
                            )
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() =>
                            handleReservationRequest(
                              ReservationStatus.Cancelled,
                              r.id
                            )
                          }
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {!isOwner && user && (
              <div className="rounded-3xl border border-slate-200 bg-white shadow-lg p-6 space-y-4">
                <div className="flex flex-col gap-2">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Your rental
                  </div>
                  <div className="flex flex-wrap items-end gap-2">
                    <span className="text-3xl font-semibold text-slate-900">
                      {dailyRateDisplay}
                    </span>
                    {reservationDays > 0 && (
                      <span className="text-sm text-slate-500">
                        × {reservationDays} day{reservationDays > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  {totalCost && (
                    <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                      Total due at acceptance:{" "}
                      <strong>{formatCurrency(totalCost)}</strong>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-slate-700">
                      Start
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date as Date | null)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        placeholderText="Select start"
                        excludeDateIntervals={disabledIntervals}
                        dateFormat="MMM d, yyyy"
                        wrapperClassName="w-full"
                        customInput={<DateInputButton />}
                      />
                    </label>

                    <label className="flex flex-1 flex-col gap-2 text-sm font-medium text-slate-700">
                      End
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date as Date | null)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || undefined}
                        placeholderText="Select end"
                        excludeDateIntervals={disabledIntervals}
                        dateFormat="MMM d, yyyy"
                        wrapperClassName="w-full"
                        customInput={<DateInputButton />}
                      />
                    </label>
                  </div>

                  {selectionSummary && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-700">
                      Your selection: {selectionSummary}
                    </div>
                  )}

                  {reserveMsg && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                      {reserveMsg}
                    </div>
                  )}

                  <Button
                    className="w-full h-12 text-base"
                    onClick={handleReserve}
                    disabled={!startDate || !endDate}
                  >
                    Request reservation
                  </Button>
                </div>

                <div className="space-y-3 text-sm text-slate-600">
                  {[
                    "Response guaranteed within 24h",
                    formattedDeposit
                      ? `Deposit of ${formattedDeposit} collected on acceptance`
                      : "You’re only charged once the owner accepts",
                    "Full refund if the owner cancels",
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isOwner && !user && (
              <div className="rounded-3xl border border-slate-200 bg-white shadow-lg p-6 text-sm text-slate-600">
                <div className="font-semibold text-slate-900">Ready to reserve?</div>
                <p className="mt-2">
                  Sign in to choose your dates and request this tool from the owner.
                </p>
                <Button className="mt-4 w-full" onClick={() => navigate("/login")}>Log in</Button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <Link
            to="/tools"
            className="text-amber-600 hover:text-amber-700 font-medium"
          >
            Browse more tools →
          </Link>
        </div>
      </div>
    </div>
  );
}
