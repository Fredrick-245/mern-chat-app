const express = require("express")
const userRoutes = require("./routes/userRoutes")
const chatRoutes = require("./routes/chatRoutes")
const messageRoutes = require("./routes/messageRoutes")
const colors = require("colors")
const { chats } = require("./data/data")
const dotenv = require("dotenv")
const connectDb = require("./config/db")
const app = express()
// 
const {notFound,errorHandler} = require("./middleware/errorMiddleware")
// 
app.use(express.json())
dotenv.config()
connectDb()
app.get("/",(req,res)=>{
    res.send("Hello")
})
app.use("/api/user",userRoutes)
app.use("/api/chat",chatRoutes)
app.use("/api/message",messageRoutes)
app.use(notFound)
app.use(errorHandler)
const port = process.env.PORT || 6000

app.listen(port,console.log(`App running on port ${port}`.yellow.bold))