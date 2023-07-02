import jwt from "jsonwebtoken";

const validateJwt = (req, res, next) => {
  console.log("in validatejwt file ",req.headers.cookie);
  //the above line returns a string of all cookies which are separated with semicolon, instead of writing the logic here to find the right token from it we wrote that in the frontend and sent the token in the headers as authorization
  const { authorization } = req.headers;
  if (!authorization) {
    res
    .status(401)
    .json({ success: false, message: "Invalid User", USER: false });
    return;
  }
  const token = authorization.replace("token ", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
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