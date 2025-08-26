import { Card, CardHeader, CardTitle, CardDescription } from "./ui/card";

export default function Categories() {
  return (
    <section id="categories" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Popular categories
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { t: "Woodworking", d: "Saws, sanders, routers" },
            { t: "Outdoor & Garden", d: "Mowers, trimmers, aerators" },
            { t: "Renovation", d: "Drills, nailers, ladders" },
            { t: "Auto & Bikes", d: "Jacks, stands, wrenches" },
          ].map((c) => (
            <Card key={c.t} className="hover:border-amber-400 transition">
              <CardHeader>
                <CardTitle className="text-base">{c.t}</CardTitle>
                <CardDescription>{c.d}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
