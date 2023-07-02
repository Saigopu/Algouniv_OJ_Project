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
    <div>
      <button onClick={handleLogout}>log out</button>
    </div>
  );
}

export default LogOut;