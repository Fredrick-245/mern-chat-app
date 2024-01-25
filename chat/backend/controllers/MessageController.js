const asyncHandler  = require("express-async-handler")
const Message = require("./../models/messageModel")
exports.sendMessage = asyncHandler(async (req,res)=>{
    const {content,chatId} = req.body()
    const userId = { ...req.user._conditions }["_id"];
    if(!content || !chatId){
        res.status(400)
        throw new Error("Invalid data sent ")
    }
    let newMessage = {
        sender: userId,
        content:content,
        chat:chatId
    }
try { 
    let message = await Message.create(newMessage) 
    message = await  message.populate("sender","name pic").execPopulate();
    message = await message.populate("chat").execPopulate()

} catch(err){}
})
exports.allMessages = asyncHandler(async (req,res)=>{

})