import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { api } from "./Api";
import type { Tool } from "./Types/Tool";
import ToolCard from "./Components/ToolCard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import { useEffect, useState } from "react";
import Landing from "./Pages/Landing";
import Header from "./Components/Header";
import { Separator } from "./Components/ui/separator";
import Footer from "./Components/Footer";

function App() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get<Tool[]>("/tool")
        .then((res) => setTools(res.data))
        .catch(() => {});
    }
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Landing />
      <Separator />
      <Footer />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
