import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  const handleSignOut = () => {
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gray-300 hover:ring-2 ring-gray-500 focus:outline-none"
      >
        <span className="sr-only">Open user menu</span>
        <img
          src="https://i.pravatar.cc/100?img=3"
          alt="avatar"
          className="rounded-full w-full h-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50">
          <Link
            to="/myaccount"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            My Account
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
