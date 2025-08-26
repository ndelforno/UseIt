import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Card, CardContent } from "./ui/card";

export default function Faq() {
  return (
    <section id="faq" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
        <Card className="mt-6">
          <CardContent className="p-0">
            <Accordion type="single" collapsible className="divide-y">
              <AccordionItem value="item-1">
                <AccordionTrigger className="px-5">
                  How do deposits work?
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-slate-600">
                  Borrowers pay a small refundable deposit on certain tools.
                  It’s automatically returned on time and in good condition.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="px-5">
                  What about damage?
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-slate-600">
                  Owners can request photo proofs; optional coverage helps with
                  accidental damage.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="px-5">
                  Is my address visible?
                </AccordionTrigger>
                <AccordionContent className="px-5 pb-5 text-slate-600">
                  Exact addresses are private. Pickup spots are shared after
                  booking.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
