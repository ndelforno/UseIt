import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

export default function Trust() {
  return (
    <section id="trust" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Trust & safety
            </h2>
            <ul className="mt-4 space-y-3 text-slate-700">
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-green-500" /> ID
                & phone verification
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-blue-500" />{" "}
                Secure payments & deposits
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-amber-500" />{" "}
                Ratings, reviews, and photo proofs
              </li>
              <li className="flex gap-3">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-purple-500" />{" "}
                Optional damage coverage
              </li>
            </ul>
            <div className="mt-6">
              <Button variant="default">Learn more</Button>
            </div>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback className="bg-amber-400">MR</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Maya R.</div>
                  <div className="text-xs text-slate-500">
                    Borrowed a pressure washer
                  </div>
                </div>
              </div>
              <p className="mt-4 text-slate-700">
                “Picking up from my neighbour took five minutes, and it saved me
                $250 on a one-time job. Super smooth!”
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
