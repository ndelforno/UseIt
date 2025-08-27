import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Separator } from "./ui/separator";

export default function RootLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Separator />
      <Footer />
    </>
  );
}
