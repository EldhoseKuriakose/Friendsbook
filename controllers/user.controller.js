const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const secretKey = "Az12Eb4Tk5Ty";

//Registration of user
module.exports.register = async (req, res) => {
  if(!req.body.firstName || !req.body.email || !req.body.password || !req.body.lastName || !req.body.dob){
    //If all required fields are not available
    return res.status(404).json({
      message: "Fill required fields"
    });
  }
  //If required fields are available
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if(userExists) {
      return res.status(409).json({
        message: "Email already exists"
      });
    }
    let uniqueName = req.body.firstName.toLowerCase() + req.body.lastName.toLowerCase() + '.';
    let uniqueId = '';
    for(let i = 0; i >= 0; i++) {
      uniqueId = uniqueName + i;
      const uniqueIdExists = await User.findOne({ userName: uniqueId });
      if(!uniqueIdExists) {
        break;
      }
    }
    //Creating user
    User.create({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: uniqueId,
      phoneNumber: req.body.phoneNumber,
      dob: req.body.dob,
      avatar: req.body.avatar
    });
    return res.status(200).json({
      message: "User registered"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed due to internal server error"
    });
  }
}