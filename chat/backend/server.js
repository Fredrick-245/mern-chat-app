const express = require("express");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const colors = require("colors");
const { chats } = require("./data/data");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const app = express();
//
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
//
app.use(express.json());
dotenv.config();
connectDb();
app.get("/", (req, res) => {
  res.send("Hello");
});
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use(notFound);
app.use(errorHandler);
const port = process.env.PORT || 6000;

const server = app.listen(
  port,
  console.log(`App running on port ${port}`.yellow.bold)
);

const io = require("socket.io")(server, {
  pingTimeout: 6000,
  cors: {
    origin: "http://localhost:5173",
  },
});
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connection");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined " + room);
  });
  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;
    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id.emit("message recieved", newMessageRecieved));
    });
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.off("setup",()=>{
    console.log("USER DISCONNECTED")
    socket.leave(userData._id)
  })
});
