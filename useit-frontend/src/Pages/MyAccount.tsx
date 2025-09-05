import { useEffect, useState } from "react";
import { useAuth } from "../Components/AuthContext";
import { fetchMyTools } from "../Api";
import { Tool } from "../Types/Tool";
import { ListingCard } from "../Components/ui/ListingCard";

export default function MyAccount() {
  const [tools, setTools] = useState<Tool[]>([]);
  const { user } = useAuth();

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {tools.map((tool) => (
          <ListingCard
            title={tool.name}
            area=""
            price={tool.price}
            imageUrl={tool.imageUrl}
          />
        ))}
      </div>
    </div>
  );
}
