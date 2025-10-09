import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ListingCard } from "./ui/ListingCard";
import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTools } from "../api/tools";
import type { Tool } from "../Types/Tool";

export default function Hero() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

  const {
    data: tools = [],
    isLoading,
    isError,
  } = useQuery<Tool[], Error>({
    queryKey: ["hero-tools"],
    queryFn: fetchTools,
    staleTime: 60_000,
  });

  const featuredTools = useMemo(() => {
    if (!tools.length) return [] as Tool[];
    const shuffled = [...tools].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 4);
  }, [tools]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = term.trim();
    navigate(query ? `/tools?q=${encodeURIComponent(query)}` : "/tools");
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <svg
          className="w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 560"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <rect width="1440" height="560" fill="url(#g1)" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              Build more. <span className="text-amber-600">Buy less.</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600">
              UseIt is a neighbourhood marketplace to <strong>borrow</strong>{" "}
              tools you need and <strong>rent out</strong> the ones you own.
              Save money, reduce clutter, and meet handy neighbours.
            </p>
            <form
              className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl"
              onSubmit={onSubmit}
            >
              <Input
                aria-label="Search tools"
                placeholder="Search tools: 'pressure washer'..."
                className="h-11"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              <Button type="submit" className="h-11 px-5">
                Search
              </Button>
            </form>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <Badge variant="secondary" className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />{" "}
                Verified users
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />{" "}
                Insurance options
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />{" "}
                Secure payments
              </Badge>
            </div>
          </div>

          <Card className="bg-white/80 backdrop-blur border shadow-xl p-4">
            <div className="grid grid-cols-2 gap-4">
              {isLoading &&
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-28 animate-pulse rounded-lg bg-slate-200"
                  />
                ))}

              {!isLoading &&
                !isError &&
                featuredTools.length > 0 &&
                featuredTools.map((tool) => (
                  <ListingCard
                    key={tool.id}
                    id={tool.id}
                    title={tool.name}
                    area={tool.area}
                    price={tool.price}
                    imageUrl={tool.imageUrl}
                  />
                ))}

              {!isLoading && (isError || featuredTools.length === 0) && (
                <div className="col-span-2 text-sm text-slate-500 text-center">
                  Listings are on their way. Check back shortly!
                </div>
              )}
            </div>
            <Button
              className="mt-4 w-full bg-slate-900 text-white hover:bg-slate-800"
              onClick={() => navigate("/tools")}
            >
              Browse all tools
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
