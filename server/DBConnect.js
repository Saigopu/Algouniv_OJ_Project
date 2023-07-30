import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBconnection = async () => {
  const MONGO_URI = process.env.MONGO_URL;
  /*
  MONGO_URI is the MongoDB connection string or URI. It should be a string that specifies the details of the MongoDB server, including the host, port, database name, and authentication credentials if required. It is typically loaded from an environment variable using process.env.

{ useNewUrlParser: true } is an option object passed to mongoose.connect(). It specifies various options for the connection, such as enabling the new URL parser. In this case, useNewUrlParser: true is set to ensure that Mongoose uses the new URL parser for parsing the connection string. This option is required in newer versions of MongoDB.*/
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
    console.log("DB is connected");
  } catch (error) {
    console.log("Error while connecting with the database ", error.message);
  }
};

export default DBconnection;