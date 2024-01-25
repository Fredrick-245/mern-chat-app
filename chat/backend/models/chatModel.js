const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      required: [true, "A chat must have a chat name"],
      trim: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
      required: true,
    },
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const ChatModel = mongoose.model("Chat", ChatSchema);
module.exports = ChatModel;
