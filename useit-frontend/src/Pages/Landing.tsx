import Hero from "../Components/Hero";
import How from "../Components/How";
import Categories from "../Components/Categories";
import Trust from "../Components/Trust";
import CallToAction from "../Components/CallToAction";
import Faq from "../Components/Faq";

export default function Landing() {
  return (
    <div className="min-h-screen antialiased text-slate-800 bg-gradient-to-b from-slate-50 via-amber-50/20 to-slate-50">
      <Hero />
      <How />
      <Categories />
      <Trust />
      <CallToAction />
      <Faq />
    </div>
  );
}
