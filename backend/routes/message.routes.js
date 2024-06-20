const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const Conversation = require("../models/conversation.model.js");
const Message = require("../models/message.model.js");
const router = express.Router();
const {getReceiverSocketId} = require("../socket/socket.js");
const { io } = require('../socket/socket.js');

router.get("/:id",protectRoute,async function(req,res){
    try {
      const { id: userToChatId } = req.params;
      const senderId = req.user._id;
  
      const conversation = await Conversation.findOne({
        participants: { $all: [senderId, userToChatId] },
      }).populate("messages"); // NOT REFERENCE BUT ACTUAL MESSAGES
  
      if (!conversation) return res.status(200).json([]);
  
      const messages = conversation.messages;
  
      res.status(200).json(messages);
      } catch (error) {
        console.error("Error in getMessage controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
      }
    });


router.post("/send/:id",protectRoute,async function(req,res){

try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create and save new message
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    await newMessage.save();

    // Update conversation with new message ID
    conversation.messages.push(newMessage._id);
    await conversation.save();

    // Emit socket event to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Respond with the new message
    res.status(201).json(newMessage);
 
    
} catch (error) {
console.log("Error in sendMessage controller:",error.message);
    res.status(500).json({
        error:"Internal server error"
    });
}



})


module.exports = router; 