// ProblemDetails.js
import axios from "axios";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import React from "react";
const API_URI = "http://localhost:3000";
const ProblemDetails = ({ onLogout }) => {
  const navigate = useNavigate();

  const [problemDetails, setProblemDetails] = useState([]);
  const { problemID } = useParams();
  // const problem = problems.find((p) => p.id === id);
  useEffect(() => {
    async function getProblem() {
      await axios
        .get(`${API_URI}/api/fullProblem`, {
          params: {
            problemID: problemID,
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          setProblemDetails(res.data);
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
    getProblem();
  }, []);

  if (!problemDetails) {
    return <div>Problem not found!</div>;
  }

  return (
    <div>
      <Navbar onLogout={onLogout} />
      <h2>{problemDetails.name}</h2>
      <p>{problemDetails.problemStatement}</p>
      {/* Display other details of the problem */}
    </div>
  );
};

export default ProblemDetails;
