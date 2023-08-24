//this file is fine with error handling

import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const API_URI = "http://localhost:3000";
const API_URI = "http://18.209.111.224:3000";

function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false); // State to control the sign-up pop-up visibility
  const [showForgot, setShowForgot] = useState(false); // State to control the sign-up pop-up visibility
  const [showOTP, setShowOTP] = useState(false); // State to control the otp visibility
  const [resetPopup, setResetPopup] = useState(false); //state to control the reset popup visibility

  async function callbackFromGoogle(codeResponse) {
    console.log(codeResponse);
    const code = codeResponse.code;

    try {
      const response = await axios.post(
        `${API_URI}/api/login`,
        {
          googleCode: code,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      console.log(response.data);
      console.log(response.status);
      console.log(response.headers);
      onLogin(response.data.email);
      navigate("/problemList");
    } catch (err) {
      console.log(err);
      if (err.response.status === 500) {
        console.log(err.response.data.msg);
        alert("some internal server error, please try again");
      }
    }
  }

  async function manLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await axios.post(
        `${API_URI}/api/manLogin`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      console.log(response.data);
      console.log(response.status);
      console.log(response.headers);
      if (response.status === 201) {
        alert(response.data.msg);
        document.getElementById("email").value = "";
        document.getElementById("password").value = "";
        return;
      } else if (response.status === 202) {
        alert(response.data.msg);
        document.getElementById("password").value = "";
        return;
      } else if (response.status === 203) {
        alert(response.data.msg);
        return;
      }
      onLogin(document.getElementById("email").value);
      navigate("/problemList");
    } catch (err) {
      alert(`${err.response.data.msg}, please try again`);
    }
  }

  async function handleSignUp() {
    // Implement sign-up functionality here
    const name = document.getElementById("name").value;
    const email = document.getElementById("signupEmail").value;
    // const password = document.getElementById("signupPassword").value;

    // Perform sign-up API call
    try {
      const response = await axios.post(
        `${API_URI}/api/signUp`,
        {
          name,
          email,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      console.log(response.status);
      if (response.status === 201) {
        alert("account already exists, please login");
        setShowSignUp(false);
        return;
      }
      setShowOTP(true); // Show the OTP input field
      // Handle success or show success message
      // You can also log in the user after successful sign-up
    } catch (error) {
      console.error("Sign Up Error:", error);
      alert("check your mailID and try again");
      // Handle sign-up error or show error message
    }
  }

  const login = useGoogleLogin({
    onSuccess: callbackFromGoogle,
    // onSuccess: codeResponse => console.log(codeResponse,codeResponse.code),
    flow: "auth-code",
    onError: (err) => console.log(err),
    scope: ["openid"],
  });

  async function verifyOTP() {
    // Implement sign-up functionality here
    const name = document.getElementById("name").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const otp = document.getElementById("otp").value;
    console.log(email);
    try {
      const response = await axios.post(
        `${API_URI}/api/verifyOTP`,
        {
          name,
          email,
          password,
          otp,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      console.log("otp verified");
      if (response.status === 200) {
        alert("account created successfully, log in now");
        setShowSignUp(false); // Hide the pop-up after sign-up attempt
        setShowOTP(false); // Show the OTP input field
      }
      // Handle success or show success message
      // You can also log in the user after successful sign-up
    } catch (error) {
      console.error("Sign Up Error:", error);
      console.log(error.response.status);

      alert(`${error.response.data.msg}, please try again`);
      if (error.response.status === 600) {
        setShowSignUp(false); // Hide the pop-up after sign-up attempt
        setShowOTP(false); // Show the OTP input field
      }

      // Handle sign-up error or show error message
    }
  }

  async function deleteTempDetails() {
    const email = document.getElementById("forgotEmail").value;
    try {
      const response = await axios.post(
        `${API_URI}/api/deleteAccount`,
        {
          email,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);
      // Handle success or show success message
      // You can also log in the user after successful sign-up
    } catch (error) {
      console.error("Sign Up Error:", error);
      console.log(error.response.status);
      console.log(error.response.data.msg);

      // alert(`${error.response.data.msg}, please try again`);
      // here there is no alert because this feature is abstracted from the user, means there is no need of mentioning the functionality and the progress of this feature.
      // Handle sign-up error or show error message
    }
  }

  async function handleConfirm() {
    // Implement sign-up functionality here
    const email = document.getElementById("forgotEmail").value;

    // Perform sign-up API call
    try {
      await axios
        .post(
          `${API_URI}/api/forgotPass`,
          {
            email,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          console.log(res.status);
          if (res.status === 201) {
            alert("account already exists, please login");
            setShowForgot(false);
            return;
          }
          setShowOTP(true); // Show the OTP input field
        })
        .catch((err) => {
          //this is for the default error status codes.
          console.log(err);
          console.log(err.response.status);
          console.log(err.response.data.msg);
          alert(err.response.data.msg); //following the convention of msg for the message sent by the server
          return;
        });
    } catch (error) {
      console.error("Sign Up Error:", error);
      alert("check your mailID and try again");
      // Handle sign-up error or show error message
    }
  }

  async function verifyResetOTP() {
    const email = document.getElementById("forgotEmail").value;
    const otp = document.getElementById("otpReset").value;
    try {
      await axios
        .post(
          `${API_URI}/api/checkResetOTP`,
          {
            email,
            otp,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          // setShowForgot(false);
          setShowOTP(false);
          setResetPopup(true);
          //lets see if we should keep any message here to the user
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
          setShowForgot(false);
          alert(err.response.data.msg);
        });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleReset() {
    const email = document.getElementById("forgotEmail").value;
    const newPass = document.getElementById("newPass").value;
    const reEnteredOne = document.getElementById("reEnter").value;
    if (newPass !== reEnteredOne) {
      alert(
        "your re entered password is not same as the new passowrd, please try again"
      );
      return;
    }
    try {
      await axios
        .post(
          `${API_URI}/api/resetPass`,
          {
            email,
            newPass,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          setShowForgot(false);
          setShowOTP(false);
          setResetPopup(false);
          alert(`${res.data.msg}, login with the new password now`); //data might not be needed, chech later
        })
        .catch((err) => {
          console.log(err);
          console.log(err.response);
          alert(
            `${err.response.data.msg}, try again giving the new password or start from the beginning`
          );
        });
    } catch (err) {
      alert("some error in the server, try again");
      return;
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4 items-center py-5">
        <div>
          <label htmlFor="email">Email: </label>
          <input
            id="email"
            type="text"
            placeholder="email"
            className="border-2 border-black rounded"
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            type="password"
            placeholder="password"
            className="border-2 border-black rounded"
          />
        </div>
        <button
          onClick={() => manLogin()}
          className="border-2 border-black text-xl rounded"
        >
          Sign In
        </button>
        <button
          onClick={() => login()}
          className="border-2 border-black text-xl rounded"
        >
          Google
        </button>
        {/* Toggle the sign-up pop-up visibility */}
        <button
          onClick={() => setShowSignUp(!showSignUp)}
          className="border-2 border-black text-xl rounded"
        >
          Sign Up
        </button>
        <button
          onClick={() => setShowForgot(!showForgot)}
          className="border-2 border-black text-xl rounded"
        >
          Forgot Password
        </button>
      </div>

      {showForgot && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-50 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Password Reset</h2>

            <div>
              <label htmlFor="forgotEmail">Email:</label>
              <input
                id="forgotEmail"
                type="email"
                placeholder="Email"
                className="border-2 border-black rounded"
                disabled={showOTP}
                required
              />
            </div>

            {!showOTP && !resetPopup && (
              <div>
                <button
                  onClick={() => {
                    handleConfirm(); // Handle sign-up functionality
                  }}
                  className="border-2 border-black text-xl mt-4 rounded"
                >
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setShowForgot(false);
                  }} // Hide the pop-up when cancel button is clicked
                  className="border-2 border-black text-xl mt-4 ml-2 rounded"
                >
                  Cancel
                </button>
              </div>
            )}
            {showOTP && (
              <div>
                <h4 className="block">otp sent to your email</h4>
                <label htmlFor="otpReset">OTP:</label>
                <input
                  id="otpReset"
                  type="text"
                  placeholder="OTP"
                  className="border-2 border-black rounded"
                />
                <button
                  onClick={() => {
                    verifyResetOTP();
                  }}
                  className="border-2 border-black rounded"
                >
                  Verify
                </button>
                <button
                  onClick={() => {
                    deleteTempDetails();
                    setShowForgot(false);
                    setShowOTP(false);
                    //implemet:- functionality to clear the temporary data created in the mongo about the user with otp should be deleted when the user cancels the sign up
                  }}
                  className="border-2 border-black rounded"
                >
                  Cancel
                </button>
              </div>
            )}
            {resetPopup && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-50 bg-opacity-75 flex items-center justify-center">
                <div className="bg-white p-8 rounded-md shadow-md">
                  <h2 className="text-xl font-bold mb-4">Password Reset</h2>

                  <div>
                    <label htmlFor="newPass">New Password:</label>
                    <input
                      id="newPass"
                      type="password"
                      placeholder="New Password"
                      className="border-2 border-black rounded"
                      // disabled={showOTP}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="reEnter">Enter again:</label>
                    <input
                      id="reEnter"
                      type="password"
                      placeholder="Enter the password again"
                      className="border-2 border-black rounded"
                      // disabled={showOTP}
                      required
                    />
                  </div>
                  <button
                    onClick={() => {
                      handleReset();
                    }}
                    className="border-2 border-black text-xl mt-4 rounded "
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      deleteTempDetails();
                      setShowForgot(false);
                      setShowOTP(false);
                      setResetPopup(false);
                      //implemet:- functionality to clear the temporary data created in the mongo about the user with otp should be deleted when the user cancels the sign up
                    }}
                    className="border-2 border-black text-xl mt-4 ml-2 rounded "
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sign-up pop-up */}
      {showSignUp && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-50 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">Sign Up</h2>
            <div>
              <label htmlFor="name">Name:</label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                className="border-2 border-black rounded"
                disabled={showOTP}
                required
              />
            </div>
            <div>
              <label htmlFor="signupEmail">Email:</label>
              <input
                id="signupEmail"
                type="email"
                placeholder="Email"
                className="border-2 border-black rounded"
                disabled={showOTP}
                required
              />
            </div>
            <div>
              <label htmlFor="signupPassword">Password:</label>
              <input
                id="signupPassword"
                type="password"
                placeholder="Password"
                className="border-2 border-black rounded"
                disabled={showOTP}
                required
              />
            </div>
            {!showOTP && (
              <div>
                <button
                  onClick={() => {
                    handleSignUp(); // Handle sign-up functionality
                  }}
                  className="border-2 border-black text-xl mt-4 rounded"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setShowSignUp(false)} // Hide the pop-up when cancel button is clicked
                  className="border-2 border-black text-xl mt-4 ml-2 rounded"
                >
                  Cancel
                </button>
              </div>
            )}
            {showOTP && (
              <div>
                <h4 className="block">otp sent to your email</h4>
                <label htmlFor="otp">OTP:</label>
                <input
                  id="otp"
                  type="text"
                  placeholder="OTP"
                  className="border-2 border-black rounded"
                />
                <button
                  onClick={() => {
                    verifyOTP();
                    //implemet:- verifying otp function should be handled here. if the otp is correct then only the above two should happen , otherwise no component change, simply show the error message
                  }}
                  className="border-2 border-black rounded"
                >
                  Verify
                </button>
                <button
                  onClick={() => {
                    deleteTempDetails();
                    setShowSignUp(false); // Hide the pop-up after sign-up attempt
                    setShowOTP(false); // Show the OTP input field
                    //implemet:- functionality to clear the temporary data created in the mongo about the user with otp should be deleted when the user cancels the sign up
                  }}
                  className="border-2 border-black "
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AuthPage;
