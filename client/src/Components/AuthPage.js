import React from "react";
import jwt_decode from "jwt-decode";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URI = "http://localhost:8000";

function AuthPage({onLogin}) {
  const navigate=useNavigate();
  async function callbackFromGoogle(codeResponse) {
    console.log(codeResponse);
    const code = codeResponse.code;

    const response = await axios.post(`${API_URI}/login`, {
      googleCode: code,
    },
    {
      withCredentials:true,
    });
    console.log(response);
    console.log(response.data);
    console.log(response.status);
    console.log(response.headers);
    onLogin();
    navigate("/problemList")
  }

  const login = useGoogleLogin({
    onSuccess: callbackFromGoogle,
    // onSuccess: codeResponse => console.log(codeResponse,codeResponse.code),
    flow: "auth-code",
    onError: (err) => console.log(err),
    scope: ["openid"],
  });

  return (
    <div>
      <button onClick={() => login()} className="border-2 border-black text-xl">
        enter
      </button>
    </div>
  );
}

export default AuthPage;
