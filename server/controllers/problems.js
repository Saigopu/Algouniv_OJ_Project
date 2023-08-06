import { problemList, fullProblem } from "../models/problemList.js";
import { submittedFiles } from "../models/problemList.js";
import fs from "fs";

export const getProblemList = async (req, res) => {
  try {
    const problemListDocs = await problemList.find({});

    if (!problemListDocs || problemListDocs.length === 0) {
      return res
        .status(404)
        .json({ msg: "No documents found in the problemList model." });
    }

    // Assuming you want to send the documents as a JSON response
    return res.json(problemListDocs);
  } catch (error) {
    console.error("Error while fetching problemList documents:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFullProblem = async (req, res) => {
  try {
    // const { problemID, email } = req.params;//this worked when there only one field that is problemID
    const { problemID, email } = req.query;
    console.log(problemID, email,req.params);
    const fullProblemDoc = await fullProblem.findOne({
      problemID: problemID,
    });

    if (!fullProblemDoc) {
      return res
        .status(404)
        .json({ msg: "No documents found in the fullProblem model." });
    }
    const filePathObject = await submittedFiles.findOne({
      useremail: email,
      problemID: problemID,
    });
    console.log(filePathObject)
    let latestCode;
    if (filePathObject) {
      if (
        filePathObject['filePathRunner'] &&
        fs.existsSync(filePathObject['filePathRunner'])
      ) {
        latestCode = fs.readFileSync(
          filePathObject['filePathRunner']
        ).toString();
        // console.log(fullProblemDoc['latestCode']);
      } else if (
        filePathObject['filePathSubmit'] &&
        filePathObject['filePathSubmit'].length > 0 &&
        fs.existsSync(
          filePathObject['filePathSubmit'][
            filePathObject['filePathSubmit'].length - 1
          ]
        )
      ) {
        latestCode = fs.readFileSync(
          filePathObject['filePathSubmit'][
            filePathObject['filePathSubmit'].length - 1
          ]
        ).toString();
      }
      else{
        latestCode = "";
      }
    }
    return res.json({ fullProblemDoc, latestCode });
  } catch (error) {
    console.error("Error while fetching fullProblem documents:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
