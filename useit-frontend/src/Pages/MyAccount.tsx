import { useAuth } from "../Components/AuthContext";

export default function MyAccount() {
  const { user } = useAuth();
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Account</h1>
      <p>Welcome {user?.email} !</p>
      <p>Here you can manage your account settings and view your activity.</p>
    </div>
  );
}
