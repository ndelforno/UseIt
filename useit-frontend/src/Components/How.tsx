import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function How() {
  return (
    <section id="how" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">1. Browse</CardTitle>
              <CardDescription>
                Search nearby tools by category, price, and dates.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">2. Book & Pickup</CardTitle>
              <CardDescription>
                Reserve securely, then meet at a convenient time.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">3. Return & Review</CardTitle>
              <CardDescription>
                Return on time and leave feedback. Earn credits by listing your
                tools.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
}
