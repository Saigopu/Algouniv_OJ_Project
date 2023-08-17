import React from "react";
import Navbar from "./Navbar";
import LogOut from "./LogOut";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URI = "http://localhost:3000";
function Profile({ onLogout }) {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  //here also we should keep the loader, as of know we done any code that makes blocks so we dont need it, but we will keep once api calls starts
  // const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function getProfile() {
      await axios
        .get(`${API_URI}/api/userDetails`, {
          params: {
            email: sessionStorage.getItem("email"),
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          setUserDetails(res.data);
        })
        .catch((err) => {
          console.log(err, err.response.status);
          if (err.response.status === 401) {
            document.cookie =
              "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            alert("session expired");
            onLogout(); //here there may be error, didnt test
            navigate("/");
          }
          alert(err.response.data.msg);
          //display a proper message and delete the token if present in the cookie and route to the login page
        });
    }
    getProfile();
  }, []);

  // const solved = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17];
  // console.log(solved);
  if (!userDetails) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <Navbar />
      <div className="m-5 border-2 border-black p-5 rounded">
        <h2 className="font-bold text-lg">{userDetails.name}</h2>
        <img src={userDetails.picture} alt="your image" />
        <h2 className="mt-4 font-serif font-semibold">Solved Problems List</h2>
        <div className="overflow-y-auto h-60  mb-7  bg-navbarBG">
          
          {userDetails.problemsSolved.map((see) => {
            {/* console.log(see, " here inside the map"); */}
            {/* dont know why return is needed here, but without it the content is not begin rendered, see it later */}
            return (
              <div className="border-2 border-black m-1  bg-gray-200 flex">

                <h2 className="font-bold text-lg">{see}</h2>
                {/* <p className="text-sm">Solved</p> */}
              </div>
            );
          })}
        </div>
        <LogOut onLogout={onLogout} />
      </div>
    </div>
  );
}

export default Profile;
