import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './Components/Header'
import { api } from './Api';
import type { Tool } from './Types/Tool';
import ToolCard from './Components/ToolCard';
import Login from './Pages/Login';
import Register from './Pages/Register';
import { useEffect, useState } from 'react';

function App() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api.get<Tool[]>("/tool").then(res => setTools(res.data)).catch(() => {});
    }
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route
              path="/"
              element={
                <div className="pt-20 flex flex-wrap justify-center bg-gray-100">
                  {tools.map((tool) => (
                    <ToolCard key={tool.id} {...tool} />
                  ))}
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;