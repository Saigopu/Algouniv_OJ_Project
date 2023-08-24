//this file if fine with error handling, status code 500

import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import { generateOtp } from "../utils/common.js";
import { userDetails, userDetailsTemp } from "../models/user.js";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import sha512 from "js-sha512";
import dotenv from "dotenv";
dotenv.config();

export const signUP = async (req, res) => {
  try {
    const { name, email } = req.body;
    let otp = generateOtp(6);
    console.log(req.body);
    const user = {
      useremail: email,
      otp: otp,
    };

    const userPermanent = await userDetails.findOne({ useremail: email });
    if (userPermanent) {
      return res.status(201).json({ msg: "user already exists" });
    }

    //lets find whether the user is already having the account\
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
        name: name,
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
    console.log(err);
    return res.status(500).json({ msg: `${err}, try again` });
  }
};

export const verifyOTP = async (req, res) => {
  const { name, email, password, otp } = req.body;

  try {
    let userData = await userDetailsTemp.findOne({ useremail: email });

    if (userData) {
      // check otp
      if (otp === userData.otp) {
        const user = {
          username: name,
          useremail: email,
          password: sha512(password + process.env.SHA_SECRET),
        };
        const userToSave = new userDetails(user);
        await userToSave
          .save()
          .then((result) => {
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
          });

        let deletedUserData = await userDetailsTemp.findOneAndDelete({
          useremail: email,
        });

        res.status(200).json({
          msg: "Success",
        });
      } else {
        res.status(400).json({ msg: "Invalid otp" });
      }
    } else {
      res.status(600).json({ msg: "sent otp expired, please try again" });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Error in verifying, try again",
      error: error,
    });
  }
};

export const deleteAccount = async (req, res) => {
  const { email } = req.body;

  try {
    let deletedUserData = await userDetailsTemp.findOneAndDelete({
      useremail: email,
    });

    if (deletedUserData) {
      res.status(200).json({ msg: "Account deleted successfully" });
    } else {
      res.status(400).json({ msg: "Account was not found in the database" });
    }
  } catch (error) {
    res.status(500).json({
      msg: "Error deleting account try again",
      error: error,
    });
  }
};

export const manLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await userDetails.findOne({ useremail: email });
    if (!userExists) {
      return res
        .status(201)
        .json({ msg: "user does not exists, please signup" });
    }
    if (userExists.password === "google login user") {
      return res
        .status(203)
        .json({
          msg: "please login with google or create a new password by clicking the forgot pass button",
        });
    }
    if (userExists.password !== sha512(password + process.env.SHA_SECRET)) {
      return res.status(202).json({ msg: "password is incorrect" });
    }
    const tokenId = uuidv4();
    const token = jwt.sign(
      { email: userExists.useremail, tokenId: tokenId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const cookieOptions = {
      // domain: "localhost",
      domain: "18.209.111.224",
      path: "/",
      // secure: true,
      httpOnly: true,
    };
    console.log("this is the token ", token);
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      msg: "Login Successful",
      email: userExists.useremail,
    });
  } catch (err) {
    return res.status(500).json({ msg: `${err}, try again` });
  }
};

//this code snippet is saved because it has the functionality to update the document(deleting a field and adding a field)
// if (otp === userData.otp) {
//   const updatedUserData = await userDetails.findByIdAndUpdate(
//     userData._id, // Find by the document's _id
//     {
//       $unset: { otp: "" },
//       $unset: { createdAt: "" },
//       $set: { verified: true },
//     },
//     { new: true } // Set 'new' option to true to get the updated document
//   );

// export const signUP = async (req, res) => {
//   const { name, email, password } = req.body;
//   console.log(req.body);

//   let testAccount = await nodemailer.createTestAccount();

//   const transporter = nodemailer.createTransport({
//     host: "smtp.ethereal.email",
//     port: 587,
//     secure: false,
//     auth: {
//       // TODO: replace `user` and `pass` values from <https://forwardemail.net>
//       user: testAccount.user,
//       pass: testAccount.pass,
//     },
//   });

//   const message = {
//     from: '"Fred Foo 👻" <foo@example.com>', // sender address
//     to: "bar@example.com, baz@example.com", // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   };

//   transporter
//     .sendMail(message)
//     .then((info) => {
//       // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//       return res
//         .status(200)
//         .json({
//           msg: "email sent",
//           info: info.messageId,
//           previewUrl: nodemailer.getTestMessageUrl(info),
//         });
//     })
//     .catch((err) => {
//       console.log(err);
//       return res.status(500).json({ err });
//     });
// };
