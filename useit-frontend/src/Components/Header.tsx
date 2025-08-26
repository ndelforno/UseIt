import { LogoMark } from "./LogoMark";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <a href="#" className="flex items-center gap-2">
            <LogoMark className="w-8 h-8" />
            <span className="font-semibold tracking-tight text-xl">UseIt</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#how" className="hover:text-amber-700">
              How it works
            </a>
            <a href="#categories" className="hover:text-amber-700">
              Categories
            </a>
            <a href="#trust" className="hover:text-amber-700">
              Trust & safety
            </a>
            <a href="#faq" className="hover:text-amber-700">
              FAQ
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="#" className="text-sm hover:text-amber-700">
              Log in
            </a>
            <Button className="rounded-full px-4">Get started</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
