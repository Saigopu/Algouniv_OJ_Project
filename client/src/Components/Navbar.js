import React from "react";
import { useNavigate, NavLink } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  return (
    <div className="flex gap-7 h-12 bg-navbarBG p-3 ">
      <NavLink
        to="/problemList"
        className="text-navbarText hover:text-white transition-colors flex-grow "
      >
        ProblemList
      </NavLink>
      <NavLink
        to="/colab"
        className="text-navbarText hover:text-white transition-colors flex-grow"
      >
        Colab
      </NavLink>
      <NavLink
        to="/profile"
        className="text-navbarText hover:text-white transition-colors flex-grow-0"
      >
        Profile
      </NavLink>
    </div>
  );
}

export default Navbar;
