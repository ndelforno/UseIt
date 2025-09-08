import { fetchTools } from "../Api";
import { ListingCard } from "../Components/ui/ListingCard";
import { Tool } from "../Types/Tool";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";
import { useSearchParams } from "react-router-dom";

export default function Tools() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const data = fetchTools();
    data.then((res) => setTools(res)).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) return tools;
    return tools.filter((t) => {
      const fields = [t.name, t.description, t.category, t.area, t.postalCode]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return fields.includes(trimmedQuery);
    });
  }, [tools, query]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim();
    setSearchParams(q ? { q } : {});
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tools</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-xl mb-4"
      >
        <Input
          aria-label="Search tools"
          placeholder="Search tools: 'pressure washer'..."
          className="h-11"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" className="h-11 px-5">
          Search
        </Button>
      </form>

      {filtered.length === 0 ? (
        <p>No tools found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {filtered.map((tool) => (
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
      )}
    </div>
  );
}
