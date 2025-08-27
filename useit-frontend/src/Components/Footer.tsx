import { LogoMark } from "./LogoMark";

export default function Footer() {
  return (
    <footer className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2">
              <LogoMark className="w-7 h-7" />
            </div>
            <p className="mt-3 text-slate-600">Borrow better. Share smarter.</p>
          </div>
          <div>
            <div className="font-medium">Product</div>
            <ul className="mt-2 space-y-2 text-slate-600">
              <li>
                <a href="#how" className="hover:text-amber-700">
                  How it works
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700">
                  Insurance
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-medium">Company</div>
            <ul className="mt-2 space-y-2 text-slate-600">
              <li>
                <a href="#" className="hover:text-amber-700">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <div className="font-medium">Legal</div>
            <ul className="mt-2 space-y-2 text-slate-600">
              <li>
                <a href="#" className="hover:text-amber-700">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-amber-700">
                  Privacy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 text-xs text-slate-500">© 2025 UseIt</div>
      </div>
    </footer>
  );
}
