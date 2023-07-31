import React from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URI = "http://localhost:3000";
function Editor({ onLogout }) {
  const navigate = useNavigate();
  const [userCode, setUserCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState(null);


  //   useEffect(() => {
  //     console.log(userCode);
  //   }, [userCode]);

  async function handleSubmit() {
    console.log(typeof userInput);
    try{
      await axios
      .post(
        `${API_URI}/api/run`,
        { lang: "cpp", code: userCode, input: userInput },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        //response.data is having the filepath and the output, have to display the output in the page
        console.log(res);
        setResult(res.data.output);
      })
      .catch((err) => {
        console.log(err, err.response.status);
        if (err.response.status === 401) {
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          alert("session expired");
          navigate("/");
        }
        if (err.response.status === 404) {
          console.log("please provide the code")
        }
        if (err.response.status === 500) {
          console.log("some error occured in compiling please try again")
        }
        //display a proper message and delete the token if present in the cookie and route to the login page
      });
    }
    catch(error){
      console.log(error)
      console.log("some error occured in compiling in the backend(issue with spawn i guess), please try again")
    }
  }

  return (
    <div>
      <Navbar onLogout={onLogout} />
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        className="border-2 border-black rounded block"
        onChange={(e) => setUserCode(e.target.value)}
      ></textarea>
      <textarea
        name=""
        id=""
        cols="30"
        rows="10"
        className="border-2 border-black rounded block"
        onChange={(e) => setUserInput(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit} className="mt-11">submit</button>
      {
        result !== null &&
        <textarea
        name=""
        id=""
        value={result}
        //make sure whenever the result is changing the changed value is rendering r not
        cols="30"
        rows="10"
        className="border-2 border-black rounded block"
      ></textarea>
      }
    </div>
  );
}

export default Editor;
