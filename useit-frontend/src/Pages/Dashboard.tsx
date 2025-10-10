import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/card";
import { Button } from "../Components/ui/button";
import { useAuth } from "../Components/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateMyProfile } from "../api/users";
import { fetchMyTools, deleteTool } from "../api/tools";
import { fetchMyReservations } from "../api/reservations";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { MyTool } from "../Types/Tool";
import type { Reservation } from "../Types/Reservation";
import { ListingCard } from "../Components/ui/ListingCard";
import { Pencil, Trash2 } from "lucide-react";

export default function Dashboard() {
  const { user, authLoading, isLoggedIn, refreshUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [profileMessage, setProfileMessage] = useState<string>("");
  const [profileErrorMsg, setProfileErrorMsg] = useState<string>("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileReadonly, setProfileReadonly] = useState(true);
  const [toolError, setToolError] = useState<string>("");

  const { data: tools = [] } = useQuery<MyTool[], Error>({
    queryKey: ["myTools"],
    queryFn: fetchMyTools,
    enabled: isLoggedIn,
  });
  const { data: reservations = [] } = useQuery<Reservation[], Error>({
    queryKey: ["myReservations"],
    queryFn: fetchMyReservations,
    enabled: isLoggedIn,
  });

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      navigate("/login", { replace: true });
    }
  }, [authLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
      });
    }
  }, [user]);

  const validateProfile = () => {
    const nextErrors: Record<string, string> = {};
    if (!profileForm.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!profileForm.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!profileForm.phone.trim()) nextErrors.phone = "Phone is required.";
    if (!profileForm.address.trim()) nextErrors.address = "Address is required.";
    if (!profileForm.city.trim()) nextErrors.city = "City is required.";
    setProfileErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (profileReadonly) return;
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileMessage("");
    setProfileErrorMsg("");
    if (!validateProfile()) return;

    try {
      setSavingProfile(true);
      await updateMyProfile(profileForm);
      await refreshUser();
      setProfileMessage("Profile updated successfully.");
      setProfileReadonly(true);
    } catch (err: any) {
      setProfileErrorMsg(err?.message || "Failed to update profile.");
    } finally {
      setSavingProfile(false);
    }
  };

  const pendingBadge = (count?: number) =>
    count && count > 0 ? (
      <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 text-center">
        {count} pending reservation
        {count > 1 ? "s" : ""}
      </div>
    ) : null;

  const reservationCards = useMemo(
    () =>
      reservations.map((r) => (
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
      )),
    [navigate, reservations]
  );

  if (authLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="sm:flex sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-2xl">My dashboard</CardTitle>
              <CardDescription>Everything you need in one place</CardDescription>
            </div>
            <div className="text-sm text-slate-500">{user?.email}</div>
          </CardHeader>
          {!user?.isProfileComplete && (
            <CardContent>
              <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-700">
                Complete your profile so renters know who you are.
              </div>
            </CardContent>
          )}
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Profile details</CardTitle>
                <CardDescription>Update your contact information</CardDescription>
              </div>
              <Button
                type="button"
                className="bg-slate-900 text-white hover:bg-slate-800"
                onClick={() => {
                  if (profileReadonly) {
                    setProfileReadonly(false);
                  } else {
                    setProfileReadonly(true);
                    setProfileMessage("");
                    setProfileErrorMsg("");
                    setProfileErrors({});
                    if (user) {
                      setProfileForm({
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        phone: user.phone || "",
                        address: user.address || "",
                        city: user.city || "",
                      });
                    }
                  }
                }}
              >
                {profileReadonly ? "Edit" : "Cancel"}
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {profileErrorMsg && (
                  <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
                    {profileErrorMsg}
                  </div>
                )}
                {profileMessage && (
                  <div className="p-3 rounded bg-green-50 text-green-700 text-sm">
                    {profileMessage}
                  </div>
                )}
                {[
                  { name: "firstName", label: "First name", placeholder: "Jane" },
                  { name: "lastName", label: "Last name", placeholder: "Doe" },
                  { name: "phone", label: "Phone", placeholder: "(555) 555-5555" },
                  { name: "address", label: "Address", placeholder: "123 Main St" },
                  { name: "city", label: "City", placeholder: "Toronto" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-slate-700">
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      value={(profileForm as any)[field.name]}
                      onChange={handleProfileChange}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:bg-slate-100 disabled:text-slate-500"
                      placeholder={field.placeholder}
                      disabled={profileReadonly}
                    />
                    {profileErrors[field.name] && (
                      <p className="text-xs text-red-600 mt-1">{profileErrors[field.name]}</p>
                    )}
                  </div>
                ))}
                <Button
                  type="submit"
                  className="w-full bg-slate-900 text-white hover:bg-slate-800"
                  disabled={savingProfile || profileReadonly}
                >
                  {savingProfile ? "Saving..." : "Save changes"}
                </Button>
              </form>
            </CardContent>
          </Card>

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
                  {toolError && (
                    <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                      {toolError}
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
                                  setToolError("");
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
                                    setToolError("Failed to delete listing. Please try again.");
                                  }
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          }
                        />
                        {pendingBadge(tool.pendingCount)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {reservationCards}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
