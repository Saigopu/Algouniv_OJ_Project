// this file is fine with error handling, status code 500
// this file is used to get the profile details of the user

import { userDetails } from "../models/user.js";
import { submittedFiles } from "../models/problemList.js";

export const getUserDetails = async (req, res) => {
 try{
  const { email } = req.query; //this worked when there only one field that is problemID
  console.log("in userDetail.js file in server ", email);

  const userDoc = await userDetails.findOne({
    useremail: email,
  });
  console.log(userDoc, " in the userDetail.js file in server");
  const allSolved = await submittedFiles.find({
    useremail: email,
    isSolved: true,
  });
  let solvedProblems = [];
  allSolved.forEach((element) => {
    solvedProblems.push(element.name);
  });

  console.log("in userDetail.js file in server ", allSolved, typeof allSolved);
  console.log("in userDetail.js file in server ", solvedProblems);
  res.status(200).json({
    name: userDoc.username,
    problemsSolved: solvedProblems,
    picture: userDoc.picture,
  });
 }
 catch(err){
  return res.status(500).json({ msg: "Internal server error, try again" });
 }
};
