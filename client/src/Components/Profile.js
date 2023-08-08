import React from "react";
import Navbar from "./Navbar";
import LogOut from "./LogOut";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URI = "http://localhost:3000";
function Profile({ onLogout }) {
  const navigate = useNavigate();

//here also we should keep the loader, as of know we done any code that makes blocks so we dont need it, but we will keep once api calls starts

  return (
    <div>
      <Navbar />
      <div className="m-5 border-2 border-black p-5">
        <LogOut onLogout={onLogout} />
      </div>
    </div>
  );
}

export default Profile;
