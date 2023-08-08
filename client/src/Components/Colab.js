import React from "react";
import Navbar from "./Navbar";

 function Colab ({onLogout}) {
    //this onLogout is to run when we call any api then there is a case where the token will be expired so we direct the user to the auth page so before doing that we have to remove the session storage, look for the function onLogout in app.js
  return (
    <div>
      <Navbar />
      feature yet to come
    </div>
  );
}

export default Colab;
