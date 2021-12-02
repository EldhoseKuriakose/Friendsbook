const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const secretKey = "Az12Eb4Tk5Ty";

//Registration of user
module.exports.register = async (req, res) => {
  if(!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password || !req.body.dob){
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
      message: "Registration failed"
    });
  }
}

//User Login
module.exports.login = async(req, res) => {
  if(!req.body.email || !req.body.password) {
    return res.status(404).json({
      message: "Email and password is required"
    });
  }
  //If fields are available
  try {
    const user = await User.findOne({ email: req.body.email });
    if(user && req.body.password === user.password) {
      //Generate token
      const token = jwt.sign({ _id: user.id, email: user.email }, secretKey, { expiresIn: '60 days' });
      return res.status(200).json({
        message: "Login Successful",
        token: token,
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          dob: user.dob,
          avatar: user.avatar,
          userName: user.userName,
          phoneNumber: user.phoneNumber
        }
      });
    } else {
      return res.status(406).json({
        message: "Invalid email/password"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Login failed"
    });
  }
}

//Follow user
module.exports.follow = async (req, res) => {
  if(!req.params.userName) {
    return res.status(404).json({
      message: "User Name is required"
    });
  }
  try {
    const user = await User.findOne({ _id: req.user });
    const followedUser = await User.findOne({ userName: req.params.userName });
    if(user && followedUser) {
      //Adding user to following and follwer list
      user.following.push(followedUser);
      user.save();
      followedUser.followers.push(user);
      followedUser.save();
      return res.status(200).json({
        message: "Follow success",
        data: {
          userName: followedUser.userName,
          action: "follow"
        }
      });
    } else {
      return res.status(404).json({
        message: "User not found"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Following failed"
    });
  }
}

//Unfollow User
module.exports.unFollow = async (req, res) => {
  if(!req.params.userName) {
    return res.status(404).json({
      message: "User id is required"
    });
  }
  try {
    const user = await User.findOne({ _id: req.user });
    const unFollowedUser = await User.findOne({ userName: req.params.userName });
    if(user && unFollowedUser) {
      //Removing user from following and follwer list
      user.following.pull(unFollowedUser);
      unFollowedUser.followers.pull(user);
      user.save();
      unFollowedUser.save();
      return res.status(200).json({
        message: "Unfollow success",
        data: {
          userName: unFollowedUser.userName,
          action: "Unfollow"
        }
      });
    } else {
      return res.status(404).json({
        message: "User not found"
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Unfollowing failed"
    });
  }
}