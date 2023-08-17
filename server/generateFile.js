//handling the error so that app wont crash, and when error occures then we are returning empty string as the filepath

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";
import { submittedFiles } from "./models/problemList.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
/*
this is the template used for the below two functions
const dirCodes = path.join(__dirname, "codes");
if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

export const generateFile = async (format, content) => {
  const jobId = uuidv4();
  const fileName = `${jobId}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  await fs.writeFileSync(filePath, content);
  return filePath;
};
*/

// export const generateSubmittedFile = async (
//   format,
//   content,
//   email,
//   problemID,
//   directoryName
// ) => {
//   const dirCodes = path.join(__dirname, directoryName);
//   if (!fs.existsSync(dirCodes)) {
//     fs.mkdirSync(dirCodes, { recursive: true });
//   }
//   const jobId = uuidv4();
//   const fileName = `${jobId}.${format}`;
//   const filePath = path.join(dirCodes, fileName);
//   const filePathObject = await submittedFiles.findOne({
//     useremail: email,
//     problemID: problemID,
//   });
//   await fs.writeFileSync(filePath, content);
//   if (!filePathObject) {
//     const userToSave = new submittedFiles({
//       useremail: email,
//       problemID: problemID,
//       filePathSubmit: [filePath],
//     });
//     await userToSave
//       .save()
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     return filePath;
//   } else {
//     //i think the below if block is not needed lets see later
//     if (!filePathObject["filePathSubmit"]) {
//       const updatedFilePathsData = await submittedFiles.findByIdAndUpdate(
//         filePathObject._id, // Find by the document's _id
//         {
//           $set: { filePathRunner: [filePath] },
//         },
//         { new: true } // Set 'new' option to true to get the updated document
//       );
//       return filePath;
//     }
//     const updatedFilePathsData = await submittedFiles.findByIdAndUpdate(
//       filePathObject._id,
//       {
//         $push: { filePathSubmit: filePath },
//       },
//       { new: true }
//     );
//     return filePath;
//   }
// };

export const copyCodeToFile = async (
  format,
  content,
  email,
  problemID,
  problemName,
  directoryName
) => {
  try{
    const dirCodes = path.join(__dirname, directoryName);
  if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
  }
  //the above directory related code is place out of if and else blocks because if there is a case where the filepath is present in the db but the file is not existing in the server then atleast if the folder exist then with the writeFileSync line of code the file will be created if not exists otherwise simply content will copied
  const filePathObject = await submittedFiles.findOne({
    useremail: email,
    problemID: problemID,
  });
  const jobId = `${email}_${problemID}`;
  const fileName = `${jobId}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  if (!filePathObject) {
    const userToSave = new submittedFiles({
      useremail: email,
      problemID: problemID,
      name: problemName,
      filePathRunner: filePath,
    });
    await userToSave
      .save()
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
    await fs.writeFileSync(filePath, content);
    return filePath;
  } else {
    if (!filePathObject["filePathRunner"]) {
      // const jobId = `${email}_${problemID}.${format}`;
      // const fileName = `${jobId}.${format}`;
      // const filePath = path.join(dirCodes, fileName);
      const updatedUserData = await submittedFiles.findByIdAndUpdate(
        filePathObject._id, // Find by the document's _id
        {
          $set: { filePathRunner: filePath },
        },
        { new: true } // Set 'new' option to true to get the updated document
      );
      await fs.writeFileSync(filePath, content);
      return filePath;
    }
    await fs.writeFileSync(filePathObject["filePathRunner"], content);
    return filePathObject["filePathRunner"];
  }
  }
  catch(err){
    console.log(err);
    return "";
  }
};
