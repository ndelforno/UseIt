import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Landing from "./Pages/Landing";
import RootLayout from "./Components/RootLayout";
import MyAccount from "./Pages/MyAccount";
import Tools from "./Pages/Tools";
import AddListing from "./Pages/AddListing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Landing />} />
          <Route path="tools" element={<Tools />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="myaccount" element={<MyAccount />} />
          <Route path="addlisting" element={<AddListing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
