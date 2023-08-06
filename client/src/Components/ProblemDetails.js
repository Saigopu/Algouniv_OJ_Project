// ProblemDetails.js
import axios from "axios";
import Navbar from "./Navbar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import React from "react";
const API_URI = "http://localhost:3000";
const ProblemDetails = ({ onLogout }) => {
  const navigate = useNavigate();

  const [userCode, setUserCode] = useState("");
  const [userInput, setUserInput] = useState("");
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const [showInpRes, setShowInpRes] = useState(false);
  const [problemDetails, setProblemDetails] = useState(null);
  const { problemID } = useParams();
  // const problem = problems.find((p) => p.id === id);
  useEffect(() => {
    async function getProblem() {
      await axios
        .get(`${API_URI}/api/fullProblem`, {
          params: {
            problemID: problemID,
            email: sessionStorage.getItem("email"),
          },
          withCredentials: true,
        })
        .then((res) => {
          console.log(res);
          setProblemDetails(res.data.fullProblemDoc);
          setUserCode(res.data.latestCode);
          setUserInput(res.data.fullProblemDoc.sampleInput[0]);
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

  async function handleRun() {
    console.log(typeof userInput);
    let resp = "";
    try {
      await axios
        .post(
          `${API_URI}/api/run`,
          {
            lang: "cpp",
            code: userCode,
            input: userInput,
            email: sessionStorage.getItem("email"),
            problemID: problemID,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          //response.data is having the filepath and the output, have to display the output in the page
          console.log(res);
          resp = "Your Output:\n";
          resp += res.data.output + "\n";
          // setResult(res.data.output);
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
            console.log("please provide the code");
          }
          if (err.response.status === 500) {
            console.log("some error occured in compiling please try again");
          }
          setResult(err.response.data.msg);
          //display a proper message and delete the token if present in the cookie and route to the login page
        });
      await axios
        .post(
          `${API_URI}/api/getExpected`,
          { lang: "cpp", problemID: problemID, input: userInput },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          //response.data is having the filepath and the output, have to display the output in the page
          console.log(res);
          resp += "Expected Output:\n";
          resp += res.data.output;
          setResult(resp);
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
            console.log("please provide the code");
          }
          if (err.response.status === 500) {
            console.log("some error occured in compiling please try again");
          }
          setResult(err.response.data.msg);
          //display a proper message and delete the token if present in the cookie and route to the login page
        });
    } catch (error) {
      console.log(error);
      console.log(
        "some error occured in compiling in the backend(issue with spawn i guess), please try again"
      );
    }
  }

  async function handleSubmit() {
    try {
      await axios
        .post(
          `${API_URI}/api/getVerdict`,
          {
            lang: "cpp",
            problemID: problemID,
            code: userCode,
            email: sessionStorage.getItem("email"),
            problemID: problemID,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
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
          setResult(err.response.data.msg);
        });
    } catch (error) {
      console.log(error);
      console.log(
        "response itself is not received from the backend, error might be in the logic of the backend"
      );
    }
  }

  if (!problemDetails) {
    // return <div>Problem not found!</div>;
    return <div>Loading</div>;
  }
  // console.log(problemDetails,!problemDetails,problemDetails==={});
  return (
    // in the below div removed p-2 which is creating problem by adding a scroller to the whole page
    <div className="flex flex-wrap h-screen ">
      {/* Left Half: Question Details */}
      {/* In flexbox, when the height of a flex container is set, and the flex items inside the container do not have an explicitly defined height, they will automatically stretch to fill the available vertical space.

To achieve the desired layout where the first inner div only takes the height necessary to contain its content, you can add the flex-shrink-0 class to the first inner div. The flex-shrink-0 class prevents the flex item from shrinking when there's not enough space. */}
      <div className="w-full md:w-1/2 bg-white p-6 pt-2 shadow-md rounded-md overflow-y-auto h-screen">
        
        <h1 className="text-2xl font-bold mb-4">{problemDetails.name}</h1>
        <div className="problem-description mb-6">
          <h2 className="text-lg font-semibold mb-2">Problem Description</h2>
          <p>{problemDetails.problemStatement}</p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Input Format</h2>
          <p>{problemDetails.inputFormat}</p>
          <h2 className="text-lg font-semibold mb-2">Output Format</h2>
          <p>{problemDetails.outputFormat}</p>
        </div>
        <div className="input-output-examples mb-6">
          <h2 className="text-lg font-semibold mb-2">Sample Inputs</h2>
          <ul>
            {problemDetails["sampleInput"].map((input, index) => (
              <li key={index} className="mb-2">
                <pre className="bg-gray-100 p-2 rounded">{input}</pre>
              </li>
            ))}
          </ul>
          <h2 className="text-lg font-semibold mb-2">Sample Outputs</h2>
          <ul>
            {problemDetails["sampleOutput"].map((output, index) => (
              <li key={index} className="mb-2">
                <pre className="bg-gray-100 p-2 rounded">{output}</pre>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Half: Code Editor and Input/Output */}
      <div className="w-full md:w-1/2 pl-2 pt-2 pr-1 flex flex-col">
        {/* <div className=" h-full flex flex-col border-2 border-black"> */}
        <div className="flex-grow mb-3  ">
          <textarea
            className="w-full h-full border border-gray-300 rounded p-2 resize-none"
            value={userCode}
            onChange={(e) => {
              setUserCode(e.target.value);
            }}
            placeholder="Write your code here..."
          />
        </div>
        {/* in the below classname removed flex-col flex-1 */}
        {showInpRes && (
          <div className=" mb-4">
            <ul className="flex bg-gray-100 p-2 rounded">
              <li className="mr-2">
                <button
                  className="bg-white hover:bg-gray-200 px-4 rounded"
                  onClick={() => {
                    setShowInput(true);
                    setShowResults(false);
                  }}
                >
                  Input
                </button>
              </li>
              <li>
                <button
                  className="bg-white hover:bg-gray-200 px-4 rounded"
                  onClick={() => {
                    setShowInput(false);
                    setShowResults(true);
                  }}
                >
                  Results
                </button>
              </li>
            </ul>
            {/* mr-2 h-full */}
            {showResults && (
              <textarea
                id="result"
                className="w-full  border border-gray-300 rounded p-2 resize-none"
                value={result}
                placeholder="Result"
              />
            )}
            {showInput && (
              <textarea
                id="input"
                className="w-full  border border-gray-300 rounded p-2 resize-none"
                onChange={(e) => {
                  setUserInput(e.target.value);
                }}
                value={userInput}
                // defaultValue={problemDetails['sampleInput'][0]}
                placeholder="Input"
              />
            )}
          </div>
        )}

        <div className="flex-grow-0 h-12 ">
          <button
            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-1 rounded mr-2"
            onClick={() => {
              setShowInpRes(!showInpRes);
            }}
          >
            Console ^
          </button>
          <button
            className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-1 rounded mr-2"
            onClick={() => {
              setShowInpRes(true);
              setShowInput(false);
              setShowResults(true);
              handleRun();
            }}
          >
            Run
          </button>
          <button
            className="bg-green-500 text-white hover:bg-green-600 px-4 py-1 rounded"
            onClick={() => {
              setShowInpRes(true);
              setShowInput(false);
              setShowResults(true);
              handleSubmit();
            }}
          >
            Submit
          </button>
        </div>
        {/* </div> */}
      </div>
    </div>
  );
};

export default ProblemDetails;

// {/* <div className="w-1/2 border border-gray-300 rounded p-2">
//               {/* Results Navbar */}

//               {/* Results Content */}
//             </div> */}

// {/* <div className="bg-white p-2 h-36 rounded">
//               {/* Results content goes here */}

//             </div> */}
