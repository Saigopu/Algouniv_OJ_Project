import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const login = (req, res) => {
  const { googleCode } = req.body;

  axios
    .post("https://oauth2.googleapis.com/token", {
      code: googleCode,
      client_id:
        "6211912636-or3dqncfo54qkbt2e9835v3oej7lis2j.apps.googleusercontent.com",
      client_secret: "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",
      redirect_uri: "http://localhost:3000",
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
          res.cookie("token", token, cookieOptions);
          res.status(200).json({
            success: true,
            message: "Login Successful",
            email: user.email,
          });
        });
    });
};
