//this file is fine with error handling, status code 500

//this file is linked with the editor and the problemDetails files in the client side, this file is used to compile the code and run the code and return the output to the client side

import { exec, spawn, execSync } from "child_process";
import fs from "fs";
import mongoose from "mongoose";
import path from "path";
import { stderr, stdout } from "process";
import { fileURLToPath } from "url";
import { testCases } from "./models/problemList.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "runnerCodes");
//initially here the directory was outputs
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
const expectedOutputPath = path.join(__dirname, "solutions");
if (!fs.existsSync(expectedOutputPath)) {
  fs.mkdirSync(expectedOutputPath, { recursive: true });
}

const smoothString = (str) => {
  // define a regular expression to match newline characters or more than one consecutive space
  const regex = /(\n|\s{2,})/g;

  // replace any matches of the regular expression with a single space
  const smoothedStr = str.replace(regex, " ").trim();

  return smoothedStr;
};

export const execute = (filepath, input) => {
  //C:\Users\GOPI KRISHNA\OneDrive\Documents\algodev\Online_Judge\server\codes\c23f7f0a-d29d-4ece-812a-79298be9d697.cpp
  console.log(filepath);
  let jobId =
    path.basename(filepath).split(".")[0] +
    "." +
    path.basename(filepath).split(".")[1];
  console.log(
    "the jobid in execute.js in the execute method first ",
    path.basename(filepath).split(".")[0] +
      "." +
      path.basename(filepath).split(".")[1]
  );
  console.log("the jobid in execute.js in the execute method second ", jobId);
  const outPath = path.join(outputPath, `${jobId}.exe`);
  console.log(outPath);
  //${filepath} wrapped that in double inverted commas so that if the spaces are present in the filepath then they are ignored otherwise the parts of the filepath which are separated by space will be considered as different commands
  return new Promise((resolve, reject) => {
    try{
      // exec(`g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && .\\${jobId}.exe`,(error,stdout,stderr)=>{
    //     if(error){
    //         reject({error,stderr})
    //     }
    //     if(stderr){
    //         reject(stderr)
    //     }
    //     resolve(stdout);
    // })
    let output = "";

    // const command = `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && .\\${jobId}.exe`; //this command is working when i run locally with the spawn which has cmd as the first parameter
    const command = `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.exe`;//this command is working when i run in docker container with the spawn which has sh as the first parameter

    //spawn is like the inbuilt function, in this type of cases it is better to define the parameters and then pass instead passing directly, here when i passed the command directly then i was getting an error ragarding the spaces in the filepath

    // const process = spawn("cmd", ["/s", "/c", command], { shell: true }); //used this when i was using the windows(for making it to run locally)
    const process = spawn("sh", ["-c", command]);//used this when i was using the linux(for making it to run in docker container)

    process.stdin.write(input);
    process.stdin.end();
    process.stdout.on("data", (data) => {
      console.log("here at stdout 1");
      output += data.toString();
    });
    process.stderr.on("data", (data) => {
      console.log("here at stderr", data);
      output += data.toString();
    });
    process.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        console.log(output, typeof output);
        reject(
          `program ended with exit code ${code}, ${output.error || output}`
        );
      }
    });
    }
    catch(err){
      reject(`internal server error, ${err}, try again`);
    }
  });
};

export const expectedOutput = (problemID, input) => {
  const jobId = `problemID${problemID}`;
  const outPath = path.join(expectedOutputPath, `${jobId}.exe`);
  const filepath = path.join(expectedOutputPath, `${jobId}.cpp`);
  console.log("this is the expected output path ", expectedOutputPath);
  return new Promise((resolve, reject) => {
    try{
      //the code present here looks redundant, so have to do something to remove this
    let output = "";
    /* const command = `g++ "${filepath}" -o "${outPath}" && cd "${expectedOutputPath}" && .\\${jobId}.exe`;
    here the error was the .\\problemID.exe is not recognised as internal or external command then tried replacing the cmd.exe in spawn with command then it worked but the arguments /s /c has no sense in keeping actually they are for cmd.exe where /s is for suppressing the special characters as the part of the strings and /c is for closing the shell after the use, so changed the command to the final present one where it is working as expected and the arguments are applied to cmd.
    */
    // const command = `cd "${expectedOutputPath}" && ${jobId}.exe`;//used this command for running locally
    const command = `cd ${expectedOutputPath} && ./${jobId}.exe`;//used this command for running in docker
    const commandWithOptions = `cmd /s /c "${command}"`;
    // const process = spawn(command, ["/s", "/c", ], { shell: true });
    // const process = spawn(commandWithOptions, { shell: true });//used this to run locally 
    const process = spawn("sh", ["-c", command]);//used this to run in docker
    process.stdin.write(input);
    process.stdin.end();
    process.stdout.on("data", (data) => {
      console.log("here at stdout 2");
      output += data.toString();
    });
    process.stderr.on("data", (data) => {
      console.log("here at stderr", data);
      output += data.toString();
    });
    process.on("close", (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        console.log(output, typeof output);
        reject(
          `program ended with exit code ${code}, ${output.error || output}`
        );
      }
    });
    }
    catch(err){
      reject(`internal server error, ${err}, try again`)
    }
  });
};

export const verdict = async (filepath, problemID) => {
  let jobId =
    path.basename(filepath).split(".")[0] +
    "." +
    path.basename(filepath).split(".")[1];
  const outPath = path.join(outputPath, `${jobId}.exe`);
  //fetch the testcases of the problem problemID from mongo
  console.log(typeof problemID, problemID, "in verdict function of execute.js");
  const testcases = await testCases.findOne({ problemID: problemID });
  console.log(testcases);
  return new Promise((resolve, reject) => {
    try{
      //the code present here looks redundant, so have to do something to remove this
    let output = "";
    const commandCompile = `g++ "${filepath}" -o "${outPath}"`;
    console.log(filepath, outPath);

    try {
      execSync(commandCompile);
    } catch (err) {
      reject(err);
    }
    let t = testcases["input"].length;
    console.log(t);
    let i = 0;
    while (t--) {
      // const command = `cd "${outputPath}" && ${jobId}.exe`;//used this to run locally 
      // const commandWithOptions = `cmd /s /c "${command}"`;//used this to run locally 
      const command = `cd ${outputPath} && ./${jobId}.exe`;//used this to run docker 
      const commandWithOptions = `sh -c "${command}"`;//used this to run docker 
      const output = execSync(commandWithOptions, {
        input: testcases["input"][i],
      }).toString();
      if (smoothString(output) != testcases["output"][i]) {
        // reject(`wrong answer at testcase ${i + 1}, ${output.error || output}`);
        reject(`wrong answer at testcase ${i + 1}`);
      }
      i++;
    }
    console.log("all testcases passed in verdict function of execute.js");
    resolve("Accepted");
    }
    catch(err){
      reject(`internal server error, ${err}, try again`)
    }
  });
};
