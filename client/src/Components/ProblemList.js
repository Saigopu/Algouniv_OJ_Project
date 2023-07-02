import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
const API_URI = "http://localhost:8000";
function ProblemList({ onLogout }) {
  const navigate = useNavigate();
  async function handleCall() {
    //withcredentials is for sending and receiving the cookies from apis
    await axios
      .post(
        `${API_URI}/problemList`,
        {},
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err, err.response.status);
        if (err.response.status === 401) {
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          alert("session expired");
          navigate("/");
        }
        //display a proper message and delete the token if present in the cookie and route to the login page
      });
    //here in the request we are sending the right token in the headers as authorisaion but it is not needed, because we have set the withcredential to true means the cookies are sent in the header but all the cookies are sent, we have to find the right one from them in the backend , insted we are finding that here and sending
  }

  return (
    <div className="flex gap-14">
      <Navbar onLogout={onLogout} />
      <button onClick={handleCall}>call</button>
    </div>
  );
}

export default ProblemList;
