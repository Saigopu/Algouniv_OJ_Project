import jwt from "jsonwebtoken";

const validateJwt = (req, res, next) => {
  console.log("in validatejwt file ",req.cookies.token);
  //the above line returns a string of all cookies which are separated with semicolon, instead of writing the logic here to find the right token from it we wrote that in the frontend and sent the token in the headers as authorization
  if (!req.cookies.token) {
    res
    .status(401)
    .json({ success: false, message: "Invalid User", USER: false });
    return;
  }
  jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res
        .status(401)
        .json({ success: false, message: err.message, USER: false });
      return;
    }

    next();
  });
};
export default validateJwt;