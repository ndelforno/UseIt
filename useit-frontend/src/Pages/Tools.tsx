import { fetchTools } from "../api/tools";
import { ListingCard } from "../Components/ui/ListingCard";
import { Tool } from "../Types/Tool";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../Components/ui/input";
import { Button } from "../Components/ui/button";
import { useSearchParams } from "react-router-dom";
import { TOOL_CATEGORIES } from "../Types/Constants";
import { useQuery } from "@tanstack/react-query";

export default function Tools() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("any");

  const { data: tools = [], isLoading, error } = useQuery<Tool[], Error>({
    queryKey: ["tools"],
    queryFn: fetchTools,
    staleTime: 60_000,
  });

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
    setCategory(searchParams.get("cat") || "");
    setPriceRange(searchParams.get("pr") || "any");
  }, [searchParams]);

  const parsePrice = (p: string): number | null => {
    if (!p) return null;
    const match = p.match(/\d+(?:[\.,]\d+)?/);
    if (!match) return null;
    return Number(match[0].replace(",", "."));
  };

  const inPriceRange = (p: string) => {
    const parsedPrice = parsePrice(p);
    if (parsedPrice == null) return false;
    switch (priceRange) {
      case "under10":
        return parsedPrice < 10;
      case "10-20":
        return parsedPrice >= 10 && parsedPrice <= 20;
      case "20-50":
        return parsedPrice > 20 && parsedPrice <= 50;
      case "over50":
        return parsedPrice > 50;
      case "any":
      default:
        return true;
    }
  };

  const filtered = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    return tools.filter((t) => {
      if (category && t.category !== category) return false;
      if (!inPriceRange(t.price)) return false;
      const fields = [
        t.name,
        t.description,
        t.category,
        t.area,
        t.postalCode,
        t.brand,
        t.model,
        t.deposit,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return trimmedQuery ? fields.includes(trimmedQuery) : true;
    });
  }, [tools, query, category, priceRange]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim();
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (category) params.cat = category;
    if (priceRange && priceRange !== "any") params.pr = priceRange;
    setSearchParams(params);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">Failed to load tools.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tools</h1>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 md:flex-row md:items-center md:flex-wrap md:gap-3 max-w-4xl mb-4"
      >
        <Input
          aria-label="Search tools"
          placeholder="Search tools: 'pressure washer'..."
          className="h-11 md:w-80"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="h-11 border rounded px-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All categories</option>
          {TOOL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          className="h-11 border rounded px-2"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
        >
          <option value="any">Any price</option>
          <option value="under10">Under $10</option>
          <option value="10-20">$10 - $20</option>
          <option value="20-50">$20 - $50</option>
          <option value="over50">Over $50</option>
        </select>
        <Button type="submit" className="h-11 px-5">
          Apply
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
