import React, { useState, useRef, useEffect } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const NavbarUserMenu = ({ username }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const ref = useRef();

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="absolute top-8 right-10 z-50" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-md border border-gray-200 hover:bg-blue-100 transition"
      >
        <AccountCircleIcon className="text-blue-800" fontSize="large" />
        <span className="text-lg font-semibold text-gray-700">
          {username ? `Hi, ${username}` : ""}
        </span>
      </button>
      {open && (
        <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 min-w-[180px]">
          <button
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-t-lg transition"
            onClick={() => {
              navigate("/Profile");
              setOpen(false);
            }}
          >
            <AccountCircleIcon className="mr-2" />
            Go to Profile
          </button>
          <button
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-b-lg transition"
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("username");
              navigate("/");
            }}
          >
            <LogoutIcon className="mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default NavbarUserMenu;