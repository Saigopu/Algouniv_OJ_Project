import React from "react";
import { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import ProblemList from "./ProblemList";

function AuthPage() {
  const [user, setUser] = useState();
  const [signOut, setSignOut] = useState(true);
  // in the web page if we load the page for the first then we are getting error of unable to propertied(accounts) of undefined(google), this is because the script we are using in the head of index.html is not loaded properly, if we reload it then it is fine

  function handleCallbackResponse(response) {
    console.log("Encoded JWt Id token : " + response.credential);
    //when we click the button getting the jwt token, when we click the sign in button then google checks whether the user is there at their side and gives a jwt , now we have to handle this jwt for our authentication. The jwt will have useful info within its payload , we have to decode it
    var UserObject = jwt_decode(response.credential);
    console.log(UserObject);
    setUser(UserObject);
    document.getElementById("signInDiv").hidden = true;
    setSignOut(false);
  }

  function handleSignOut(event) {
    setUser({});
    document.getElementById("signInDiv").hidden = false;
    console.log(event);
    setSignOut(true);
  }

  useEffect(() => {
    // this google object is coming from the script that is includede in the index.html, that script is going to load before the react renders
    window.google.accounts.id.initialize({
      client_id:
        "6211912636-or3dqncfo54qkbt2e9835v3oej7lis2j.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    window.google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      { theme: "outline", size: "large" }
    );

    window.google.accounts.id.prompt();
      //the above line will display all the accounts with which we were signingIn in the past at the top right, just like when we open gfg site it asks for the authentication at the top right which is just one tap authentication
  }, []);

  return (
    // we will keep two buttons here one is signup and signin, both are using google
    <>
      {/* <div className="border-2 flex mt-36 border-black items-center gap-3 p-3 flex-col w-1/2 mx-auto rounded">
        <button className="border-2 border-black rounded">SignUp with google</button>
        <button className="border-2 border-black rounded">SignIn with google</button>
      </div> */}
      <div id="signInDiv"></div>
      <button hidden={signOut} onClick={(e) => handleSignOut(e)}>
        Sign Out
      </button>
      {/* in the above button we are maintaining a state to know whether to display it or not but we can do that with the conditional rendering also just same as how we are displaying the user picture and name when user is a valid object, it follows like this
      {
        Object.keys(user).length != 0 &&

        <button onClick={(e)=>handleSignOut(e)}>Sign Out</button>
      }
       */}
      {
        //this is conditional rendering, if the user is valid other that null, undefined, false, empty string then the element after && will be rendered
        user && (
          <div>
            <img src={user.picture} />
            <h3>{user.name}</h3>
          </div>
        )
      }
    </>
  );
}

export default AuthPage;
