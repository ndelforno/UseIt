import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useNavigate } from "react-router-dom";

export default function CallToAction() {
  const navigate = useNavigate();
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-semibold">
                Have tools gathering dust?
              </h3>
              <p className="text-slate-700 mt-1">
                List them on UseIt, set your price, and earn credits or cash.
              </p>
            </div>
            <Button
              className="px-6 py-3 bg-amber-600 hover:bg-amber-700"
              onClick={() => {
                navigate("/addlisting");
              }}
            >
              List a tool
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
