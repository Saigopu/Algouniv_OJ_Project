// documentation https://nodejs.org/api/child_process.html

import { rejects } from "assert";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { stderr, stdout } from "process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

export const execute = (filepath) => {
  //C:\Users\GOPI KRISHNA\OneDrive\Documents\algodev\Online_Judge\server\codes\c23f7f0a-d29d-4ece-812a-79298be9d697.cpp
  console.log(filepath);
  const jobId=path.basename(filepath).split(".")[0];
  const outPath=path.join(outputPath,`${jobId}.exe`)
  console.log(outPath);
  //${filepath} wrapped that in double inverted commas so that if the spaces are present in the filepath then they are ignored otherwise the parts of the filepath which are separated by space will be considered as different commands
  return new Promise((resolve,reject)=>{
    exec(`g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && .\\${jobId}.exe`,(error,stdout,stderr)=>{
        if(error){
            reject({error,stderr})
        }
        if(stderr){
            reject(stderr)
        }
        resolve(stdout);
    })
  })
};
