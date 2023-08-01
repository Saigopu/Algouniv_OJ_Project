import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  problemsID: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
});

const fullProblemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  problemsID: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  problemStatement: {
    type: String,
    required: true,
  },
  // inputFormat: {
  //     type: String,
  //     required: true,
  // },
  // outputFormat: {
  //     type: String,
  //     required: true,
  // },
  // constraints: {
  //     type: String,
  //     required: true,
  // },
  // sampleInput: {
  //     type: String,
  //     required: true,
  // },
  // sampleOutput: {
  //     type: String,
  //     required: true,
  // },
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
export const problemList = mongoose.model("problemList", problemSchema);
export const fullProblem = mongoose.model("fullProblem", fullProblemSchema);
