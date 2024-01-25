const User = require("./../models/userModel");
const generateToken = require("./../config/generateToken");
//
const asyncHandler = require("express-async-handler");
exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({
      status: "Error",
      message: "Please enter all fields",
    });
    throw new Error("Please enter all Fields");
  }

  const userExists = await User.findOne({ emai: email });
  if (userExists) {
    res.status(400).json({
      status: "error",
      message: "User already exists",
    });
  }

  const newUser = await User.create({ name, email, password });
  if (newUser) {
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(500).json({
      status: "Eror",
      message: "Failed to create user",
    });
    throw new Error("Failed to create user");
  }
});
exports.authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const newUser = await User.findOne({ email });
  if (newUser && newUser.matchPassword(password)) {
    res.status(200).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      pic: newUser.pic,
      token: generateToken(newUser._id),
    });
  } else {
    res.status(401).json({
      status: "Error",
      message: "Invalid email or password",
    });
  }
});

exports.searchUser = asyncHandler(async (req, res) => {
    console.log(req.query.search);
    const keyWord = req.query.search ? {
        $or:[
            {name :{$regex:req.query.search,$options:"i"}},
            {email :{$regex:req.query.search,$options:"i"}},
        ]

    } :{}
    const users = await User.find(keyWord)/*.find({_id:{$ne:req.user.id}})*/
    res.status(200).json({users})

});
