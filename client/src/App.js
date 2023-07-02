import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./Components/AuthPage.js";
import ProblemList from "./Components/ProblemList.js";
import { useState, useEffect } from "react";

function App() {
  const [isLogged, setIsLogged] = useState(false);

  // useEffect(() => {
  //   cookiePresent();
  // }, []);

  // function cookiePresent() {
  //   var cookies = document.cookie.split(";");
  //   var cookieValue;
  //   const cookieName = "token";
  //   for (var i = 0; i < cookies.length; i++) {
  //     var cookiePair = cookies[i].trim();
  //     if (cookiePair.startsWith(cookieName + "=")) {
  //       cookieValue = cookiePair.substring(cookieName.length + 1);
  //     }
  //   }
  //   if (cookieValue !== undefined) {
  //     console.log("control at app.js line 21", cookieValue);
  //     setIsLogged(true);
  //     console.log(isLogged);
  //   }
  // }

  // useEffect(()=>{
  //   console.log(isLogged)
  // },[isLogged])

  function handleLogin() {
    setIsLogged(true);
  }

  function handleLogout() {
    console.log("logout button clicked")
    setIsLogged(false);
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage onLogin={handleLogin} />} />
        <Route
          path="/problemList"
          element={isLogged ? <ProblemList onLogout={handleLogout}/> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
