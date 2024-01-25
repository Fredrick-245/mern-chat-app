const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

exports.accessChat = asyncHandler(async (req, res) => {
  const id = req.body.id;
  const userId = { ...req.user._conditions }["_id"];

  if (!id) {
    res.status(400);
    throw new Error("Please make sure youre logged In");
  }
  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: userId } },
        users: { $elemMatch: { $eq: id } },
      },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  if (isChat.length > 0) {
    res.send(isChat[0]);
    console.log(isChat);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [userId, id],
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).send(fullChat);
    } catch (err) {
      throw new Error(err.message);
    }
  }
});
exports.fetchChats = asyncHandler(async (req, res) => {
  const userId = { ...req.user._conditions }["_id"];
  try {
    let allChats = await Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    res.status(200).json({ allChats });
    allChats = await User.populate(allChats, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
  } catch (err) {
    throw new Error(err.message);
  }
});

exports.createGroupChat = asyncHandler(async (req, res) => {
  const userId = { ...req.user._conditions }["_id"];
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({
      status: "error",
      message: "Plese fill all fields",
    });
  }

  const users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than two users are required to form group chat");
  }
  console.log(users);
  users.push(userId);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: userId,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (err) {
    throw new Error(err);
  }
});

exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
    if(!updatedChat){
        res.status(404)
        throw new Error("Chat Not Found")
    } else {
        res.json(updatedChat)
    }
});

exports.addToGroup = asyncHandler(async (req,res)=>{
    const {chatId,userId}= req.body

    const added = await Chat.findByIdAndUpdate(chatId,{
        $push:{users:userId}
    },{
        new:true
    }).populate("users","-password").populate("groupAdmin","-password")

    if(!added){
        res.status(400)
        throw new Error("Not Found")
    } else {
        res.status(200).json(added)
    }

})
exports.removeFromGroup = asyncHandler (async (req,res)=>{
    const {chatId,userId} = req.body
    const removed = await Chat.findByIdAndUpdate(chatId,{
        $pull:{users:userId}
    },{
        new:true
    }).populate("users","-password").populate("groupAdmin","-password")

    if(!removed){
        res.status(400)
        throw new Error("Not Found")
    } else {
        res.status(200).json(removed)
    }

})