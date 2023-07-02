import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LogOut from "./LogOut";

const API_URI = "http://localhost:8000";
function ProblemList({onLogout}) {
  const navigate = useNavigate();
  async function handleCall() {
    console.log(document.cookie);
    var cookies = document.cookie.split(";"); // Step 2
    var cookieValue;
    const cookieName = "token";
    for (var i = 0; i < cookies.length; i++) {
      var cookiePair = cookies[i].trim();
      if (cookiePair.startsWith(cookieName + "=")) {
        // Step 3
        cookieValue = cookiePair.substring(cookieName.length + 1); // Step 4
      }
    }
    if (cookieValue === undefined) {
      alert("session expired");
      navigate("/");
      return;
    }
    console.log(cookieValue);
    const response = await axios
      .post(
        `${API_URI}/problemList`,
        {},
        {
          withCredentials: true,
          headers: {
            authorization: `token ${cookieValue}`,
          },
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
      <button onClick={handleCall}>call</button>
      <LogOut onLogout={onLogout}/>
    </div>
  );
}

export default ProblemList;
