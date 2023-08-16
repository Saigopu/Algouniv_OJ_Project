import mongoose from "mongoose";
import { stringify } from "uuid";

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  problemID: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
});

const fullProblemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  problemID: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  problemStatement: {
    type: String,
    required: true,
  },
  inputFormat: {
    type: String,
    required: true,
  },
  outputFormat: {
    type: String,
    required: true,
  },
  // constraints: {
  //     type: String,
  //     required: true,
  // },
  sampleInput: {
    type: [String],
    //here we can put the array of strings, as of know giving only one sample input
    required: true,
  },
  sampleOutput: {
    type: [String],
    required: true,
  },
  // explanation: {
  //     type: String,
  //     required: true,
  // },
  // difficulty: {
  //     type: String,
  //     required: true,
  // },
  // timeLimit: {
  //     type: Number,
  //     required: true,
  // },
  // memoryLimit: {
  //     type: Number,
  //     required: true,
  // },
  // tags: {
  //     type: [String],
  //     required: true,
  // },
});

const testCasesSchema = new mongoose.Schema({
  problemID: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  input: {
    type: [String],
    required: true,
  },
  output:{
    type:[String],
    required:true,
  },
});

const submittedFilesSchema= new mongoose.Schema({
  useremail:{
    type: String,
    required: true,
  },
  problemID:{
    type: mongoose.Schema.Types.Number,
    required:true,
  },
  filePathRunner:{
    type:String,
    required:true,
  },
})
export const submittedFiles=mongoose.model("submittedFiles",submittedFilesSchema);
export const testCases = mongoose.model("testCases", testCasesSchema);
export const problemList = mongoose.model("problemList", problemSchema);
export const fullProblem = mongoose.model("fullProblem", fullProblemSchema);
