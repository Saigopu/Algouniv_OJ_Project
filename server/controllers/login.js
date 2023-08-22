//i think this file is fine with the error handling, status code 500

import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { userDetails } from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();

export const login = async (req, res) => {
  const { googleCode } = req.body;

  axios
    .post("https://oauth2.googleapis.com/token", {
      code: googleCode,
      client_id:
        "6211912636-or3dqncfo54qkbt2e9835v3oej7lis2j.apps.googleusercontent.com",
      client_secret: "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",
      redirect_uri: "http://localhost:3000",
      //here in the above url the port was 3000 because for frontend the port was 3000 and for backend it is 8000 but later i changed the port of the backend to 3000 and frontend will run in 3001 , so i was facing the google login error, the error was "network error", then i have changed the port number and it worked. i found the error is occuring in this file by adding the catches for the api call that are made here , initailly ther were not there and the app was crashing and was unable to detect where the error was occuring, try catches and the .catch which follows .then during the returned promise resolution are important
      //now changing the port to 3000 again as iam done with the development and iam testing it in the docker so i think the page should be redirected to 3000
      grant_type: "authorization_code",
    })
    .then((response) => {
      const accessToken = response.data.access_token;

      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((resp) => {
          console.log("the response from Google in the server", resp.data);
          const user = resp.data;
          const tokenId = uuidv4();
          const token = jwt.sign(
            { email: user.email, tokenId: tokenId },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
          const cookieOptions = {
            domain: "localhost",
            path: "/",
            // secure: true,
            // httpOnly: true,
          };
          console.log("this is the token ", token);

          const savingUser = {
            username: user.name,
            useremail: user.email,
            password: "google login user",
            picture: user.picture,
          };

          saveUserToDatabase(savingUser)
            .then(() => {
              // Set the token cookie and send the response to the client
              res.cookie("token", token, cookieOptions);
              res.status(200).json({
                success: true,
                msg: "Login Successful",
                email: user.email,
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({ msg: "Error saving user details" });
            });

          // res.cookie("token", token, cookieOptions);
          // res.status(200).json({
          //   success: true,
          //   message: "Login Successful",
          //   email: user.email,
          // });
        })
        .catch((err) => {
          console.log(err, "here iam at line 52");
          res.status(500).json({
            msg: "error during the api call in the login.js file in the backend--2, try again",
          });
        });
    })
    .catch((err) => {
      console.log(err, "here iam at line 57");
      res.status(500).json({
        msg: "error during the api call in the login.js file in the backend--1, try again",
      });
    });
};

async function saveUserToDatabase(savingUser) {
  const userExists = await userDetails.findOne({
    useremail: savingUser.useremail,
  });
  //With this modification, the function will return a resolved promise with undefined if the user already exists (since there's no further asynchronous operation in this case). If the user does not exist and the saving process is successful, it will return a resolved promise with the result of the saving operation. If the saving process fails, it will return a rejected promise with the error.
  if (!userExists) {
    try {
      const userToSave = new userDetails(savingUser);
      console.log(userToSave);
      const result = await userToSave.save();
      console.log(result);
    } catch (error) {
      throw error;
    }
  }
}
