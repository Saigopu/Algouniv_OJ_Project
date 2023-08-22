//error handling later

import { userDetails, userDetailsTemp } from "../models/user.js";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { generateOtp } from "../utils/common.js";
import sha512 from "js-sha512";
import dotenv from "dotenv";
dotenv.config();

export const forgotPassword = async (req, res) => {
  try {
    //error handling
    // first take the email from the req.body
    const { email } = req.body;
    console.log("email in the forgotPass.js ", email);
    // check if the email exists in the database
    const isUserThere = await userDetails.findOne({ useremail: email });
    if (!isUserThere) {
      res
        .status(404)
        .json({
          msg: "You dont have an account with this email, please signup",
        });
      return;
    }
    // if the email exists, then generate a random otp and send it to the email
    // generate a random otp
    let otp = generateOtp(6);
    console.log("otp in the forgotPass.js ", otp);
    //send the mail to the provided email
    const user = {
      useremail: email,
      otp: otp,
    };
    const userExists = await userDetailsTemp.findOne({ useremail: email });

    if (userExists) {
      otp = userExists.otp;
    } else {
      //user details are saved here as soon as the button signup is clicked before otp verification
      const userToSave = new userDetailsTemp(user);
      console.log(userToSave);
      await userToSave
        .save()
        .then((result) => {
          console.log(result);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(config);

    let mailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
      },
    });

    const response = {
      body: {
        name: isUserThere.username, //here may be the error
        intro: `this is your otp ${otp}`,
        outro: "looking forward for long lasted connection with you",
      },
    };

    let mail = mailGenerator.generate(response);

    const message = {
      from: process.env.EMAIL, // sender address
      to: email, // list of receivers
      subject: "email verification", // Subject line
      html: mail, // html body
    };

    transporter
      .sendMail(message)
      .then((info) => {
        return res.status(200).json({
          msg: "email sent",
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ err });
      });
  } catch (err) {
    console.log("error in forgotpassword method in file forgotpass.js", err);
    return res
      .status(500)
      .json({ msg: "some error occured, please try again" });
  }
};

export const resetVerifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const userExists = await userDetailsTemp.findOne({ useremail: email });
    if (!userExists) {
      return res.status(404).json({ msg: "otp expired, please try again" });
    }
    if (otp === userExists.otp) {
      return res.status(200).json({ msg: "success" });
    }
    return res
      .status(404)
      .json("wrong otp, try again or start from the beginning");
  } catch (err) {
    console.log("error in resetverifyotp method in file forgotpass.js", err);
    return res
      .status(500)
      .json({ msg: "some error occurred, please try again" });
  }
};

export const passwordReset = async (req, res) => {
  try {
    const { email, newPass } = req.body;
    const userExists = await userDetails.findOne({ useremail: email });
    if (!userExists) {
      return res.status(404).json({
        msg: "unable to fetch your account details, please try again after some time or try signing up with this email, sorry for the inconvience",
      });
    }
    const password = sha512(newPass + process.env.SHA_SECRET);
    const updatedOne = await userDetails.updateOne(
      {
        useremail: email,
      },
      {
        $set: { password: password },
      },
      {
        new: true,
      }
    );
    return res.status(200).json({ msg: "password updated successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ msg: "some error occured, please try again" });
  }
};
