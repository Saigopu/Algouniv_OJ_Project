import { exec, spawn } from "child_process";
import fs from "fs";
import path from "path";
import { stderr, stdout } from "process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

export const execute = (filepath, input) => {
  //C:\Users\GOPI KRISHNA\OneDrive\Documents\algodev\Online_Judge\server\codes\c23f7f0a-d29d-4ece-812a-79298be9d697.cpp
  console.log(filepath);
  const jobId = path.basename(filepath).split(".")[0];

  const outPath = path.join(outputPath, `${jobId}.exe`);
  console.log(outPath);
  //${filepath} wrapped that in double inverted commas so that if the spaces are present in the filepath then they are ignored otherwise the parts of the filepath which are separated by space will be considered as different commands
  return new Promise((resolve, reject) => {
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

    const command = `g++ "${filepath}" -o "${outPath}" && cd "${outputPath}" && .\\${jobId}.exe`;//this command is working when i run locally with the spawn which has cmd as the first parameter
    // const command = `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.exe`;//this command is working when i run in docker container with the spawn which has sh as the first parameter

    //spawn is like the inbuilt function, in this type of cases it is better to define the parameters and then pass instead passing directly, here when i passed the command directly then i was getting an error ragarding the spaces in the filepath
    
    const process = spawn("cmd", ["/s", "/c", command], { shell: true });//used this when i was using the windows(for making it to run locally)
    // const process = spawn("sh", ["-c", command]);//used this when i was using the linux(for making it to run in docker container)

    process.stdin.write(input);
    process.stdin.end();
    process.stdout.on("data", (data) => {
      console.log("here at stdout");
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
  });
};
