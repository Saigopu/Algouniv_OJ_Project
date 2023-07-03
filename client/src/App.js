import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import AuthPage from "./Components/AuthPage.js";
import ProblemList from "./Components/ProblemList.js";
import { useState, useEffect } from "react";
import Editor from "./Components/Editor";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLocalStorage();
  }, []);

  function checkLocalStorage() {
    const token = sessionStorage.getItem("token");
    if (token) {
      setIsLogged(true);
    }
    setIsLoading(false);
    //state update in react is asynchronous, the remaining part is executed even before the state is updated, so we have to hold the control flow at proper places for the desired behavior of the app
  }

  function handleLogin() {
    setIsLogged(true);
    sessionStorage.setItem("token", "your_token_here");
  }

  function handleLogout() {
    setIsLogged(false);
    sessionStorage.removeItem("token");
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }
  //this is to implement the feature that when we reload the page then it should not redirect to the authpage because we already done with the authentication, so we are stopping the control with this return to not to go to the path "/" and when the islogged is changed the component will trigger a re-render then the other return will work
  //before the above return was there , had a problem that when we are in a page and reload it then we are redirected to authpage

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage onLogin={handleLogin} />} />
        <Route
          path="/problemList"
          element={
            isLogged ? (
              <ProblemList onLogout={handleLogout} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/editor"
          element={
            isLogged ? <Editor onLogout={handleLogout} /> : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
