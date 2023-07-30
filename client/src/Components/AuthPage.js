import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URI = "http://localhost:3000";

function AuthPage({ onLogin }) {
  const navigate = useNavigate();
  const [showSignUp, setShowSignUp] = useState(false); // State to control the sign-up pop-up visibility
  const [showOTP, setShowOTP] = useState(false); // State to control the otp visibility

  async function callbackFromGoogle(codeResponse) {
    console.log(codeResponse);
    const code = codeResponse.code;

    const response = await axios.post(
      `${API_URI}/login`,
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
    onLogin();
    navigate("/problemList");
  }

  async function manLogin() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await axios.post(
      `${API_URI}/apiManLogin`,
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
    if(response.status===201){
      alert(response.data.msg);
      document.getElementById("email").value="";
      document.getElementById("password").value="";
      return;
    }
    else if(response.status===202){
      alert(response.data.msg);
      document.getElementById("password").value="";
      return;
    }
    onLogin();
    navigate("/problemList");
  }

  async function handleSignUp() {
    // Implement sign-up functionality here
    const name = document.getElementById("name").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    // Perform sign-up API call
    try {
      const response = await axios.post(
        `${API_URI}/apiSignUp`,
        {
          name,
          email,
          password,
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
        `${API_URI}/apiVerifyOTP`,
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
    const email = document.getElementById("signupEmail").value;
    try {
      const response = await axios.post(
        `${API_URI}/apiDeleteAccount`,
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

      // Handle sign-up error or show error message
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
            className="border-2 border-black"
          />
        </div>
        <div>
          <label htmlFor="password">Password: </label>
          <input
            id="password"
            type="password"
            placeholder="password"
            className="border-2 border-black"
          />
        </div>
        <button onClick={() => manLogin()} className="border-2 border-black text-xl">Sign In</button>
        <button
          onClick={() => login()}
          className="border-2 border-black text-xl"
        >
          Google
        </button>
        {/* Toggle the sign-up pop-up visibility */}
        <button
          onClick={() => setShowSignUp(!showSignUp)}
          className="border-2 border-black text-xl"
        >
          Sign Up
        </button>
      </div>

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
                className="border-2 border-black"
                disabled={showOTP}
              />
            </div>
            <div>
              <label htmlFor="signupEmail">Email:</label>
              <input
                id="signupEmail"
                type="text"
                placeholder="Email"
                className="border-2 border-black"
                disabled={showOTP}
              />
            </div>
            <div>
              <label htmlFor="signupPassword">Password:</label>
              <input
                id="signupPassword"
                type="password"
                placeholder="Password"
                className="border-2 border-black"
                disabled={showOTP}
              />
            </div>
            {!showOTP && (
              <div>
                <button
                  onClick={() => {
                    handleSignUp(); // Handle sign-up functionality
                  }}
                  className="border-2 border-black text-xl mt-4"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setShowSignUp(false)} // Hide the pop-up when cancel button is clicked
                  className="border-2 border-black text-xl mt-4 ml-2"
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
                  className="border-2 border-black"
                />
                <button
                  onClick={() => {
                    verifyOTP();
                    //implemet:- verifying otp function should be handled here. if the otp is correct then only the above two should happen , otherwise no component change, simply show the error message
                  }}
                  className="border-2 border-black"
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
