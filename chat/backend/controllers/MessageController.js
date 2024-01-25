const asyncHandler = require("express-async-handler");
const Message = require("./../models/messageModel");
const Chat = require("../models/chatModel");
exports.sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body();
  const userId = { ...req.user._conditions }["_id"];
  if (!content || !chatId) {
    res.status(400);
    throw new Error("Invalid data sent ");
  }
  let newMessage = {
    sender: userId,
    content: content,
    chat: chatId,
  };
  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("chat").execPopulate();
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });
    await Chat.findByIdAndUpdate(req.body.chatId,{
        latestMessage:message
    })
    res.json(message)
  } catch (err) {
    res.status(400)
    throw new Error(err.message)
  }
}); 
exports.allMessages = asyncHandler(async (req, res) => {});
