import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Separator } from "./ui/separator";

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Separator />
      <Footer />
    </div>
  );
}
