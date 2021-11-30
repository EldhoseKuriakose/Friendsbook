//Importing required libraries
const jwt = require("jsonwebtoken");
const secretKey = "Az12Eb4Tk5Ty";

//Authentication with jsonwebtoken
module.exports.authenticate = (req, res, next) => {
  if (req.headers.token) {
    //If token found in the header
    try {
      const token = jwt.verify(req.headers.token, secretKey);
      req.user = token._id;
      next();
    } catch (err) {
      //Token is invalid
      console.log("Invalid Token", err);
      return res.status(401).json({
        message: "Unauthorized"
      });
    }
  } else {
    //Token not found in header
    console.log("Required token for authorization");
    return res.status(404).json({
      message: "Required token for authorization"
    });
  }
};
