import express from "express";
import validateJwt from "../middleware/validateJWT.js";

import { login } from "../controllers/login.js";
import { generateFile } from "../generateFile.js";
import { execute } from "../execute.js";
//this file is for routing, we will map the function with their corresponding routes, but we dont write the functions here we write in some specific folders and import

//this is backend routing, this will be just for api calls. At some locations some methods will be there when user clicks any button which is connected in the frontend to raise the api request from the browser to specific location in the backend then the methods will be executed and the response will be sent, whatever api requests the browser make are not visible to the browser, they are only visible in the networks tab

// all the frontend routing that is on clicking the buttons navigating to different pages will be done in react in frontend part only

// so we can summarise in this way if there is button then it can be categorised in two ways , one is to navigate the frontend pages and the other is to raise the api requests

const router = express.Router();
//here this forward slash is important, i thought it will be working because we kept one in the server.js file but it is not
router.post("/login", login);
router.get("/check", (req, res) => {
  res.json("checked");
});

router.post("/problemList", validateJwt, (req, res) => {
  res.send("hello gopi");
});

router.post("/run", validateJwt, async (req, res) => {
  try {
    const { lang = "cpp", code,input } = req.body;
    if (code === undefined) {
      res.status(404).json({ success: false, error: "empty code" });
    }
    const filepath = await generateFile(lang, code);
    const output = await execute(filepath,input);

    res.json({ filepath, output });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});

export default router;
