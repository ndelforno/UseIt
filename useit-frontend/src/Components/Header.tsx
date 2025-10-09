import { Link } from "react-router-dom";
import { LogoMark } from "./LogoMark";
import { Button } from "./ui/button";
import AvatarMenu from "./ui/AvatarMenu";
import { useAuth } from "./AuthContext";

export default function Header() {
  const { isLoggedIn } = useAuth();
  const accountLinks = isLoggedIn ? (
    <AvatarMenu />
  ) : (
    <>
      <a href="/login" className="text-sm hover:text-amber-700">
        Log in
      </a>
      <Link to="/register">
        <Button className="rounded-full px-4">Get started</Button>
      </Link>
    </>
  );
  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex w-full items-center justify-between gap-4 md:w-auto md:gap-6">
            <a href="/" className="flex items-center gap-4">
              <LogoMark className="w-20 h-20" />
            </a>
            <div className="flex items-center gap-3 md:hidden">{accountLinks}</div>
          </div>
          <nav className="flex w-full flex-wrap items-center justify-center gap-4 text-sm md:w-auto md:flex-1 md:flex-nowrap md:justify-center md:gap-6">
            <a href="/#how" className="hover:text-amber-700">
              How it works
            </a>
            <a href="/#categories" className="hover:text-amber-700">
              Categories
            </a>
            <a href="/#trust" className="hover:text-amber-700">
              Trust & safety
            </a>
            <a href="/#faq" className="hover:text-amber-700">
              FAQ
            </a>
            <Link to="/tools" className="hover:text-amber-700">
              All tools
            </Link>
          </nav>
          <div className="hidden items-center justify-end gap-3 md:flex">{accountLinks}</div>
        </div>
      </div>
    </header>
  );
}
