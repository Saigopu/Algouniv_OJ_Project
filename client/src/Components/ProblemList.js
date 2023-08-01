import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const API_URI = "http://localhost:3000";
function ProblemList({ onLogout }) {
  const navigate = useNavigate();
  const [problemList, setProblemList] = useState([]);

  useEffect(() => {
    async function getList() {
      await axios
        .get(`${API_URI}/api/problemList`, {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          setProblemList(res.data);
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
    getList();
  }, []);

  async function handleCall() {
    //withcredentials is for sending and receiving the cookies from apis
    await axios
      .post(
        `${API_URI}/api/problemList`,
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
          onLogout(); //here there may be error, didnt test
          navigate("/");
        }
        //display a proper message and delete the token if present in the cookie and route to the login page
      });
    //here in the request we are sending the right token in the headers as authorisaion but it is not needed, because we have set the withcredential to true means the cookies are sent in the header but all the cookies are sent, we have to find the right one from them in the backend , insted we are finding that here and sending
  }


  return (
    <>
      <div className="flex gap-14">
        <Navbar onLogout={onLogout} />
        <button onClick={handleCall}>call</button>
      </div>
      {problemList.map((problem) => (
        <div key={problem.problemID} className="border-2 border-black">
          <h1>{problem.name}</h1>
          <button onClick={()=>{navigate(`/problems/${problem.problemID}`)}}>open</button>
        </div>
      ))}
    </>
  );
}

export default ProblemList;

// useEffect(() => {
//   getData()
// }, [])

// const getData=async()=>{
//   const volunteerData = await axios.post('http://localhost:5000/admin/fetchvol',{}, {
//       headers: {
//           authorization: `Token ${localStorage.getItem("token")}`
//       }
//   }).then((res) => {
//       console.log(res);
//       setVolunteers(res.data.volList);
//       console.log(volunteers);
//   })
//   .catch(err => {
//       console.log(err);
//   })
// }
//// this is how i did earlier
