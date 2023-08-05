import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

export const generateFileNew = async (format, content, directoryName) => {
  const dirCodes = path.join(__dirname, directoryName);
  if (!fs.existsSync(dirCodes)) {
    fs.mkdirSync(dirCodes, { recursive: true });
  }
  const jobId = uuidv4();
  const fileName = `${jobId}.${format}`;
  const filePath = path.join(dirCodes, fileName);
  await fs.writeFileSync(filePath, content);
  return filePath;
};
