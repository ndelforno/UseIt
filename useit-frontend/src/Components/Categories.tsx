import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardImage,
} from "./ui/card";
import { useNavigate } from "react-router-dom";
import woodworkingImage from "../assets/woodworking.jpg";
import outdoorImage from "../assets/gardening.jpg";
import renovationImage from "../assets/renovation.jpg";
import autoImage from "../assets/mechanic.jpg";

export default function Categories() {
  const navigate = useNavigate();

  const categories = [
    {
      t: "Woodworking",
      d: "Saws, sanders, routers",
      i: woodworkingImage,
      filter: "Woodworking",
    },
    {
      t: "Outdoor & Garden",
      d: "Mowers, trimmers, aerators",
      i: outdoorImage,
      filter: "Gardening",
    },
    {
      t: "Renovation",
      d: "Drills, nailers, ladders",
      i: renovationImage,
      filter: "Renovation",
    },
    {
      t: "Auto & Bikes",
      d: "Jacks, stands, wrenches",
      i: autoImage,
      filter: "Mechanic",
    },
  ];

  return (
    <section id="categories" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Popular categories
        </h2>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((c) => (
            <Card
              key={c.t}
              className="hover:border-amber-400 transition cursor-pointer"
              onClick={() => navigate(`/tools?cat=${encodeURIComponent(c.filter)}`)}
            >
              <CardHeader>
                <CardImage src={c.i} alt="Toolbox" />
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
