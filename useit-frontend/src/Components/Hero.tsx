import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ListingCard } from "./ui/ListingCard";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Hero() {
  const navigate = useNavigate();
  const [term, setTerm] = useState("");

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
              <ListingCard
                title="Cordless Drill"
                area="East Danforth"
                price="$6"
              />
              <ListingCard
                title="Pressure Washer"
                area="Leslieville"
                price="$15"
              />
              <ListingCard title="Table Saw" area="The Beaches" price="$22" />
              <ListingCard title="Lawn Aerator" area="Riverdale" price="$12" />
            </div>
            <p className="mt-4 text-xs text-slate-500 text-center">
              Sample listings for mock-up only
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
