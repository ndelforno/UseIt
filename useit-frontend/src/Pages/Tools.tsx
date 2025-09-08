import { fetchTools } from "../Api";
import { ListingCard } from "../Components/ui/ListingCard";
import { Tool } from "../Types/Tool";
import { useEffect, useState } from "react";

export default function Tools() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    const data = fetchTools();
    data.then((res) => setTools(res));
  }, []);

  return (
    <>
      {tools.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Tools</h1>
          <p>Here you can browse tools.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {tools.map((tool) => (
              <ListingCard
                key={tool.id}
                id={tool.id}
                title={tool.name}
                area={tool.area}
                price={tool.price}
                imageUrl={tool.imageUrl}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
