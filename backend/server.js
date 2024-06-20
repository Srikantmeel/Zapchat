
const express = require("express");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.route.js");
const messageRoutes = require("./routes/message.routes.js");
const userRoutes = require("./routes/user.routes.js");
const connectToMongoDB = require("./db/connectToMongoDB.js");
const {app,server} = require("./socket/socket.js");



dotenv.config();
const PORT= process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/users",userRoutes);

app.get("/" ,function(req,res){

});




server.listen(PORT,()=>{
connectToMongoDB()


});