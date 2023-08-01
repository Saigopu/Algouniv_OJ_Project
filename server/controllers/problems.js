import { problemList, fullProblem } from "../models/problemList.js";

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
    const { problemsID } = req.params;
    const fullProblemDoc = await fullProblem.findOne({ problemsID: problemsID });

    if (!fullProblemDoc) {
      return res
        .status(404)
        .json({ msg: "No documents found in the fullProblem model." });
    }

    // Assuming you want to send the documents as a JSON response
    return res.json(fullProblemDoc);
  } catch (error) {
    console.error("Error while fetching fullProblem documents:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
