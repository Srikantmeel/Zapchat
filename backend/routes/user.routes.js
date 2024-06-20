const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const User = require("../models/user.model");

const router = express.Router();


router.get("/",protectRoute,async function(req,res){
try {
const loggedInUsersId = req.user._id
const filteredUsers = await User.find({_id: {$ne:loggedInUsersId}});
res.status(200).json(filteredUsers);
    
} catch (error) {
    
console.error("error in getUserForSidebar",error.message);
res.status(500).json({error:"Internal server error"});

 
}

});



module.exports = router;