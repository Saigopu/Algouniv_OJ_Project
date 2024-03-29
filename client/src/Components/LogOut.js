import React from "react";
import { useNavigate } from "react-router-dom";

function LogOut({onLogout}) {
  const navigate = useNavigate();
  function handleLogout() {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    onLogout()
    navigate("/");
  }
  return (
    <div >
      <button onClick={handleLogout} className="border-2 border-black rounded bg-red-400">Sign Out</button>
    </div>
  );
}

export default LogOut;