const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
participants:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
},
],
messages:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    default:[],
},
],




},{timestamps:true});

const Conversation = mongoose.model("conversation",conversationSchema);
module.exports = Conversation;
